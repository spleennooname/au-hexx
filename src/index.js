"use strict"

import "./styles/styles.scss"

import vs from "./glsl/vert.glsl"
import fs from "./glsl/frag.glsl"
import blends from "./glsl/blend.glsl"
import draws from "./glsl/draw.glsl"

import { dpr } from "./utils"

// import { AudioFeaturesExtractor } from './AudioFeaturesExtractor'
import { getGPUTier } from "detect-gpu"

import { from, tap } from "rxjs"

import { gsap } from "gsap"
import * as twgl from "twgl.js"

const isDev = import.meta.env.MODE === "development"
if (isDev) {
  import("https://greggman.github.io/webgl-lint/webgl-lint.js")
}

let gl, fb0, fb1, fb2, tmp
let positionBuffer

let texture
let programInfo
let blendInfo
let drawInfo

// let stats
let gpu

const log = document.querySelector("#log")
const canvas = document.querySelector("#canvas")
const cover = document.querySelector(".cover")

function demo () {
  gsap.to(cover, 5, {
    delay: 1,
    autoAlpha: 0
  })

  try {
    gl = canvas.getContext("webgl2")
    from(getGPUTier())
      .pipe(
        tap((gpu) => {
          init(gpu)
          run()
          // run()//requestAnimationFrame((t) => run(t));
        })
      )
      .subscribe()
  } catch (err) {
    throw new Error("Error", err.toString())
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
    src: "/hex.jpg",
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
        -1, 3,
        3, -1
      ],
      numComponents: 2
    }
  })
}

let now = 0
const fpsInterval = 1000 / 60
let then = 0
function run (time) {
  requestAnimationFrame(run)
  // calc elapsed time since the last loop
  now = window.performance.now()
  const elapsed = now - then

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval)
    render(now / 1000)
  }
}

function render (time) {
  const uResolution = resizeCanvasToDisplaySize(gpu)

  gl.disable(gl.CULL_FACE)
  gl.disable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!
  // draw new frame
  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer)
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texture,
    uResolution
  })
  twgl.bindFramebufferInfo(gl, fb0)
  twgl.drawBufferInfo(gl, positionBuffer)

  // blend new frame with fb1 in fb2
  gl.useProgram(blendInfo.program)
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer)
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution,
    uPersistence: 0.7,
    newTexture: fb0.attachments[0],
    oldTexture: fb1.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, fb2)
  twgl.drawBufferInfo(gl, positionBuffer)

  // draw fb2 in canvas
  gl.useProgram(drawInfo.program)
  twgl.setBuffersAndAttributes(gl, drawInfo, positionBuffer)
  twgl.setUniforms(drawInfo, {
    uTime: time,
    uResolution,
    uTexture: fb2.attachments[0]
  })
  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer)

  // swap fb1, fb2
  tmp = fb1
  fb1 = fb2
  fb2 = tmp
}

function resizeCanvasToDisplaySize (gpu) {
  const pxr = gpu.tier <= 1 ? 1 : dpr

  const { clientHeight, clientWidth } = canvas

  const w = Math.floor((clientWidth * pxr) | 0)
  const h = Math.floor((clientHeight * pxr) | 0)

  const needsResize = twgl.resizeCanvasToDisplaySize(canvas, pxr)
  if (needsResize) {
    twgl.resizeFramebufferInfo(gl, fb0, null, w, h)
    twgl.resizeFramebufferInfo(gl, fb1, null, w, h)
    twgl.resizeFramebufferInfo(gl, fb2, null, w, h)

    log.innerHTML = (gpu.gpu || "n/d") + "<br/>" +
      "tier: " + gpu.tier + "<br/>" +
      "px.ratio: " + pxr + "<br/>" +
      "fps: " + gpu.fps + "<br/>" +
      "W x H: " + w + " " + h
  }
  // console.log('resize!!', gl.drawingBufferWidth)
  return [w, h]
}

demo()
