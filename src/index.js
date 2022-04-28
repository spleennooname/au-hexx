'use strict'

import './styles/styles.scss'

import Stats from 'stats.js'

import vs from './glsl/vert.glsl'
import fs from './glsl/frag.glsl'

import blends from './glsl/blend.glsl'
import draws from './glsl/draw.glsl'

import { dpr, invlerp } from './utils'
import { AudioFeaturesExtractor } from './AudioFeaturesExtractor'
import { getGPUTier } from 'detect-gpu'

import { animationFrames, switchMap, fromEvent, debounceTime, first, delay, combineLatest, concat, from, tap, buffer } from 'rxjs'

import { gsap } from 'gsap'
import * as twgl from 'twgl.js'

let gl, fb0, fb1, fb2, tmp
let positionBuffer

let texture
let programInfo
let drawInfo
let blendInfo

let stats
let bufferSize

/*   const spector = new SPECTOR.Spector()
  spector.displayUI() */

const audioFeaturesExtractor = new AudioFeaturesExtractor()

const log = document.querySelector('#log')

const canvas = document.querySelector('#canvas')
const cover = document.querySelector('.cover')

const cover$ = fromEvent(cover, 'click')
  .pipe(
    debounceTime(300),
    first()
  )

function demo () {
  try {
    gl = canvas.getContext('webgl')
    //
    concat(
      //
      combineLatest([
        from(audioFeaturesExtractor.meyda$({ fftSize: 512 })),
        from(getGPUTier())
      ])
        .pipe(
          tap(console.log),
          tap(([meyda, gpu]) => init(gpu))
        ),
      //
      render$()
    )
      .subscribe()
  } catch (err) {
    throw new Error('Error', err.toString())
  }
}

function init (gpu) {
  // gl.getExtension('WEBGL_lose_context').restoreContext();
  // gl.getExtension('WEBGL_lose_context').loseContext();

  console.table(gpu)

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

  bufferSize = (gpu.isMobile && gpu.tier >= 3) || (!gpu.isMobile && gpu.tier > 2)
    ? Math.round(512 * 2 * dpr)
    : Math.round(512 * dpr)

  log.innerHTML = (gpu.gpu || 'n/d') + '<br/>' +
  'tier: ' + gpu.tier + '<br/>' +
  'dpratio: ' + dpr + '<br/>' +
  'fps: ' + gpu.fps + '<br/>' +
  'bufferSize: ' + bufferSize

  fb0 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize)
  fb1 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize)

  canvas.width = bufferSize
  canvas.height = bufferSize

  programInfo = twgl.createProgramInfo(gl, [vs, fs])
  // blendInfo = twgl.createProgramInfo(gl, [vs, blends])
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
  const { clientHeight, clientWidth, width, height } = canvas
  // const ar = clientWidth / clientHeight

  // const w = Math.floor((clientWidth) * dpr | 0)
  // const h = Math.floor((clientHeight) * dpr | 0)

  // const needsResize = h !== height || w !== width
  // const needsResize = twgl.resizeCanvasToDisplaySize(canvas, dpr)
  // if (needsResize) {
  /* twgl.resizeFramebufferInfo(gl, fb0, null, bufferSize, bufferSize)
  twgl.resizeFramebufferInfo(gl, fb1, null, bufferSize, bufferSize) */
  // twgl.resizeFramebufferInfo(gl, fb2, null, w, h)
  /*    canvas.width = w
    canvas.height = h */
  // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  // console.log('resize!!', gl.drawingBufferWidth)
  // }
  // console.log('resize!!', gl.drawingBufferWidth)
  return [bufferSize, bufferSize]
}

function draw (time) {
  if (!audioFeaturesExtractor) return

  const features = audioFeaturesExtractor.features([
    'perceptualSharpness',
    'perceptualSpread',
    'spectralFlatness',
    'spectralKurtosis',
    'loudness'
  ])

  if (!features) return

  let { perceptualSpread, perceptualSharpness, spectralFlatness, spectralKurtosis } = features

  const loudness = invlerp(5, 30, features.loudness.total)

  spectralKurtosis = invlerp(-30, 30, spectralKurtosis)

  // console.log(loudness /* perceptualSpread, spectralKurtosis */)
  const uResolution = [bufferSize, bufferSize]// resizeCanvasToDisplaySize()

  // www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!
  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer)
  twgl.setUniforms(programInfo, {
    loudness,
    perceptualSpread,
    perceptualSharpness,
    spectralKurtosis,
    uTime: time,
    uPatternTexture: texture,
    uResolution
  })
  twgl.bindFramebufferInfo(gl, fb0)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // blend new frame with fb1 in fb2
  /* l.useProgram(blendInfo.program)
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer)
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution,
    uPersistence: loudness,
    newTexture: fb0.attachments[0],
    oldTexture: fb1.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, fb2)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES) */

  // draw in canvas
  gl.useProgram(drawInfo.program)
  twgl.setBuffersAndAttributes(gl, drawInfo, positionBuffer)
  twgl.setUniforms(drawInfo, {
    uTime: time,
    uResolution,
    uTexture: fb1.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES)

  // swap
  /* tmp = fb1
  fb1 = fb2
  fb2 = tmp */
  tmp = fb0
  fb0 = fb1
  fb1 = tmp

  stats.update()
}

demo()
