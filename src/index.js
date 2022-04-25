'use strict'

import Stats from 'stats.js'

import vs from './glsl/vert.glsl'
import fs from './glsl/frag.glsl'

import blends from './glsl/blend.glsl'
import draws from './glsl/draw.glsl'

import { dpr } from './utils'
import { AudioFeaturesExtractor } from './AudioFeaturesExtractor'
import { getGPUTier } from 'detect-gpu'
import { animationFrames, concat, from, tap } from 'rxjs'

import { gsap } from 'gsap'
import * as twgl from 'twgl.js'

let gl, fb0, fb1, fb2, tmp
let positionBuffer

let texture
let programInfo
let drawInfo
let blendInfo

let stats

/*   const spector = new SPECTOR.Spector()
  spector.displayUI() */

const audioFeaturesExtractor = new AudioFeaturesExtractor()

const log = document.querySelector('#log')

const canvas = document.querySelector('#canvas')

function demo () {
  try {
    gl = canvas.getContext('webgl')

    concat(
      // from(audioFeaturesExtractor.meyda({ fftSize: 512 })),
      from(getGPUTier())
        .pipe(
          tap(gpu => init(gpu))
        ),
      render$()
    )
      .subscribe()
  } catch (err) {
    throw new Error('Error', err)
  }
}

function init (gpu) {
  // gl.getExtension('WEBGL_lose_context').restoreContext();
  // gl.getExtension('WEBGL_lose_context').loseContext();

  console.table(gpu)

  log.innerHTML = (gpu.gpu || 'n/d') + '<br/>' +
    'tier: ' + gpu.tier + '<br/>' +
    'dpratio: ' + dpr + '<br/>' +
    'fps: ' + gpu.fps + '<br/>'

  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement)

  gl = twgl.getContext(canvas, { depth: false, antialiasing: true })

  texture = twgl.createTexture(gl, {
    src: '/hex.jpg',
    level: false,
    minMag: gl.LINEAR,
    wrap: gl.REPEAT
  })

  fb0 = twgl.createFramebufferInfo(gl, null)
  fb1 = twgl.createFramebufferInfo(gl, null)
  fb2 = twgl.createFramebufferInfo(gl, null)

  programInfo = twgl.createProgramInfo(gl, [vs, fs])
  blendInfo = twgl.createProgramInfo(gl, [vs, blends])
  drawInfo = twgl.createProgramInfo(gl, [vs, draws])

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: {
      data: [
        -1, -1,
        -1, 4,
        4, -1
      ],
      numComponents: 2
    }
  })

  gsap.to('.cover', 5, {
    delay: 1,
    autoAlpha: 0
  })
}

/* function run () {
  now = window.performance.now()
  const delta = now - then
  if (delta > interval) {
    then = now - (delta % interval)
    stats.begin()
    draw(now / 1000)
    stats.end()
  }
  requestAnimationFrame(run)
} */

function render$ () {
  return animationFrames()
    .pipe(
      tap(({ timestamp }) => draw(timestamp / 1000))
    )
}

function resizeCanvasToDisplaySize () {
  const { clientHeight, clientWidth } = canvas
  // const ar = clientWidth / clientHeight

  const w = Math.floor(clientWidth * dpr)
  const h = Math.floor(clientHeight * dpr)

  const needsResize = twgl.resizeCanvasToDisplaySize(canvas, dpr)
  if (needsResize) {
    twgl.resizeFramebufferInfo(gl, fb0, null)
    twgl.resizeFramebufferInfo(gl, fb1, null)
    twgl.resizeFramebufferInfo(gl, fb2, null)
    console.log('resize!!', w, h, gl.drawingBufferWidth)
  }
  return [w, h]
}

function draw (time) {
  const uResolution = resizeCanvasToDisplaySize()

  // www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!
  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer)
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texture,
    uResolution
  })
  twgl.bindFramebufferInfo(gl, fb0)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // blend new frame with fb1 in fb2
  gl.useProgram(blendInfo.program)
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer)
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution,
    uPersistence: 0.8,
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
    uResolution,
    uTexture: fb2.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // swap
  tmp = fb1
  fb1 = fb2
  fb2 = tmp

  stats.update()
}

demo()
