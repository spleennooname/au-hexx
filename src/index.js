'use strict'

import './styles/styles.scss'

// import Stats from 'stats.js'

import vs from './glsl/vert.glsl'
import fs from './glsl/frag.glsl'

// import blends from './glsl/blend.glsl'
import draws from './glsl/draw.glsl'

import { dpr, invlerp } from './utils'

import { AudioFeaturesExtractor } from './AudioFeaturesExtractor'

import { getGPUTier } from 'detect-gpu'

import { animationFrames, combineLatest, concat, from, tap } from 'rxjs'

import { gsap } from 'gsap'
import * as twgl from 'twgl.js'

let gl, fb0, fb1, tmp
let positionBuffer

let texture
let programInfo
let drawInfo
let stream
let audioUnif = {}
// let blendInfo

// let stats
let gpu

/*   const spector = new SPECTOR.Spector()
  spector.displayUI() */

const audioFeaturesExtractor = new AudioFeaturesExtractor()

const log = document.querySelector('#log')
const canvas = document.querySelector('#canvas')
const cover = document.querySelector('.cover')

/* const start$ = fromEvent(canvas, 'click')
  .pipe(
    debounceTime(300),
    first()
  ) */

function demo () {
  gsap.to(cover, 5, {
    delay: 1,
    autoAlpha: 0
  })

  try {
    gl = canvas.getContext('webgl')
    //
    concat(
      //
      combineLatest([
        // start$,
        // from(audioFeaturesExtractor.meyda$({ fftSize: 512 })),
        from(getGPUTier())
      ])
        .pipe(
          tap(console.log),
          tap(([gpu]) => init(gpu))
        ),
      //
      render$()
    )
      .subscribe()
  } catch (err) {
    throw new Error('Error', err.toString())
  }
}

function init (gpuTier) {
  // gl.getExtension('WEBGL_lose_context').restoreContext();
  // gl.getExtension('WEBGL_lose_context').loseContext();

  gpu = gpuTier
  // stream = mediaStream

  console.table(gpu)

  gl = twgl.getContext(canvas, { depth: false, antialiasing: true })

  texture = twgl.createTexture(gl, {
    src: '/hex.jpg',
    level: false,
    minMag: gl.LINEAR,
    wrap: gl.REPEAT
  })

  fb0 = twgl.createFramebufferInfo(gl, null)
  fb1 = twgl.createFramebufferInfo(gl, null)
  tmp = twgl.createFramebufferInfo(gl, null)

  programInfo = twgl.createProgramInfo(gl, [vs, fs])
  // blendInfo = twgl.createProgramInfo(gl, [vs, blends])
  drawInfo = twgl.createProgramInfo(gl, [vs, draws])

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: {
      data: [
        -1, -1,
        -1, 3,
        3, -1
      ],
      numComponents: 2
    }
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

function resizeCanvasToDisplaySize (gpu) {
  const pxr = !gpu.isMobile && gpu.tier >= 3 ? dpr : 1

  const { clientHeight, clientWidth } = canvas

  const w = Math.floor((clientWidth * pxr) | 0)
  const h = Math.floor((clientHeight * pxr) | 0)

  const needsResize = twgl.resizeCanvasToDisplaySize(canvas, pxr)
  if (needsResize) {
    twgl.resizeFramebufferInfo(gl, fb0, null, w, h)
    twgl.resizeFramebufferInfo(gl, tmp, null, w, h)
    twgl.resizeFramebufferInfo(gl, fb1, null, w, h)

    console.log('resize!!', w, h)

    let maxw = 512
    if (gpu.tier <= 1) {
      maxw = 512
      canvas.style.maxWidth = `${maxw}px`
    } else if (gpu.tier <= 2) {
      maxw = 800
      canvas.style.maxWidth = `${maxw}px`
    }

    log.innerHTML = (gpu.gpu || 'n/d') + '<br/>' +
      'tier: ' + gpu.tier + '<br/>' +
      'dpratio: ' + dpr + '<br/>' +
      'fps: ' + gpu.fps + '<br/>' +
      'W x H: ' + w + ' ' + h
  }
  // console.log('resize!!', gl.drawingBufferWidth)
  return [w, h]
}

function draw (time) {
  if (stream && stream.active) {
    if (!audioFeaturesExtractor) return

    const features = audioFeaturesExtractor.features([
      'perceptualSharpness',
      'perceptualSpread',
      'spectralFlatness',
      'spectralKurtosis',
      'loudness'
    ])

    if (!features) return

    const { perceptualSpread, perceptualSharpness, spectralFlatness, spectralKurtosis } = features

    const loudness = invlerp(5, 30, features.loudness.total)
    audioUnif = {
      loudness, perceptualSharpness, perceptualSpread, spectralFlatness, spectralKurtosis
    }
  }

  // console.log(loudness /* perceptualSpread, spectralKurtosis */)
  const uResolution = resizeCanvasToDisplaySize(gpu)

  // www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!
  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer)
  twgl.setUniforms(programInfo, {
    ...audioUnif,
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
  tmp = fb0
  fb0 = fb1
  fb1 = tmp
}

demo()
