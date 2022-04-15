'use strict'

import vs from './glsl/vert.glsl'
import fs from './glsl/hex.glsl'
import blends from './glsl/blend.glsl'
import draws from './glsl/draw.glsl'

import { getGPUTier } from 'detect-gpu';

import { gsap } from 'gsap'
import * as twgl from 'twgl.js'

const IS_LOG = true

let canvas
let gl
let positionBuffer
let fb0
let fb1
let fb2
let tmp
let rafID = -1

let texturePattern
let displayWidth
let displayHeight
let programInfo
let drawInfo
let blendInfo
let stats

let now = 0
const t = 0
let then = 0

let fps = 60
let interval = 1000 / fps
let bufferSize = 512

/* function setMousePos(e) {
  mouse[0] = e.clientX / gl.canvas.clientWidth
  mouse[1] = 1 - e.clientY / gl.canvas.clientHeight
}

function handleTouch(e) {
  e.preventDefault()
  setMousePos(e.touches[0])
} */

export const dpr = Math.min(window.devicePixelRatio, 1.25)

function demo() {
  canvas = document.querySelector('#canvas')
  try {
    gl = canvas.getContext('webgl')
  } catch (err) {
    console.warn('no WebGL in da house.')
    return
  }
  if (!gl) {
    throw 'no WebGL in da house.'
    return
  }

  /* document.body.addEventListener(
    'touchmove',
    event => {
      event.preventDefault()
    },
    false
  )
 */
  canvas.addEventListener('webglcontextlost', lost, false)
  canvas.addEventListener('webglcontextrestored', restore, false)
 /*  canvas.addEventListener('mousemove', setMousePos)

  canvas.addEventListener('mouseleave', () => {
    mouse = [0.5, 0.5]
  })

  canvas.addEventListener('mousedown', e => {
    console.log(e)
  }) 

  canvas.addEventListener('contextmenu', e => e.preventDefault())
  canvas.addEventListener('touchstart', handleTouch, { passive: false })
  canvas.addEventListener('touchmove', handleTouch, { passive: false })
*/
  initGL()
  // gl.getExtension('WEBGL_lose_context').restoreContext();
  // gl.getExtension('WEBGL_lose_context').loseContext();
}

async function initGL() {

  const gpu = await getGPUTier();

  const sizes = [512, 512, 512 * 2, 512 * 4]

  console.table(gpu)
  
  fps = gpu.fps || 60
  interval = 1000 / fps

  bufferSize = sizes[gpu.tier] || 1024

  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement)

  gl = twgl.getContext(canvas, { depth: false, antialiasing: true })

  texturePattern = twgl.createTexture(gl, {
    src: '/hex.jpg',
    level: false,
    minMag: gl.LINEAR,
    wrap: gl.REPEAT
  })

  fb0 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize)
  fb1 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize)
  fb2 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize)

  programInfo = twgl.createProgramInfo(gl, [vs, fs])
  blendInfo = twgl.createProgramInfo(gl, [vs, blends])
  drawInfo = twgl.createProgramInfo(gl, [vs, draws])

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: { 
      data: [-
        1, -1, 
        -1, 4, 
        4, -1
      ], 
      numComponents: 2 
    }
  })

  start()
}

function start() {

  gsap.to('.cover', 5, {
    /*  onStart: () => { initGL() }, */
    delay: 1,
    autoAlpha: 0
  })

  stop()
  then = window.performance.now()
  run()
}

function stop() {
  rafID = cancelAnimationFrame(run)
}

function run() {
  now = window.performance.now()
  const delta = now - then
  if (delta > interval) {
    then = now - (delta % interval)
    const t = now / 1000
    stats.begin()
    render(t)
    stats.end()
  }
  rafID = requestAnimationFrame(run)
}

function resize() {
  // Lookup the bufferSize the browser is displaying the canvas in CSS pixels
  // and compute a bufferSize needed to make our drawingbuffer match it in
  // device pixels.
  const {} = canvas

  displayWidth = Math.floor(bufferSize) * dpr
  displayHeight = Math.floor(bufferSize) * dpr

  // Check if the canvas is not the same bufferSize.
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same bufferSize
    canvas.width = displayHeight
    canvas.height = displayHeight
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }
}

function render(time) {

  resize()

  // www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!
  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer)
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texturePattern,
    uResolution: [displayWidth, displayHeight]
  })
  twgl.bindFramebufferInfo(gl, fb0)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // blend new frame with fb1 in fb2
  gl.useProgram(blendInfo.program)
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer)
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution: [displayWidth, displayHeight],
    uPersistence: 0.85,
    newTexture: fb0.attachments[0],
    oldTexture: fb1.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, fb2)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // draw in canvas
  gl.useProgram(drawInfo.program)
  twgl.setBuffersAndAttributes(gl, drawInfo, positionBuffer)
  twgl.setUniforms(drawInfo, {
    uTime: time,
    uResolution: [displayWidth, displayHeight],
    uTexture: fb2.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // swap
  tmp = fb1
  fb1 = fb2
  fb2 = tmp

  /* if (IS_LOG) {
    document.querySelector('.log').innerHTML =
      'devicePixelRatio=' +
      window.devicePixelRatio +
      ' tier=' +
      gpuTools.gpuTier.levelTier +
      ' type=' +
      gpuTools.gpuTier.type +
      '<br/>' +
      'applied: ' +
      'pixel ratio=' +
      pixelRatio +
      ', fps=' +
      fps +
      '<br/>' +
      '(' +
      window.innerWidth +
      ',' +
      window.innerHeight +
      ')' +
      '<br/>' +
      '(' +
      canvas.width +
      ',' +
      canvas.height +
      ')' +
      '<br/>' +
      '(buffer bufferSize: ' +
      bufferSize +
      ')'
  } */
}

function destroy() {
  stop()
}

function lost(e) {
  console.warn('lost')
  event.preventDefault()
  stop()
}

function restore(e) {
  console.warn('restored')
  initGL()
}

demo()
