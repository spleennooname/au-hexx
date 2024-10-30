"use strict"

import "./styles/styles.scss"
import vs from "./glsl/vert.glsl"
import fs from "./glsl/frag.glsl"
import blends from "./glsl/blend.glsl"
import draws from "./glsl/draw.glsl"
import { dpr } from "./utils"
import { getGPUTier } from "detect-gpu"
import { from } from "rxjs"
import { gsap } from "gsap"
import * as twgl from "twgl.js"

// Costanti
const FRAME_RATE = 60
const FRAME_INTERVAL = 1000 / FRAME_RATE
const DEFAULT_PERSISTENCE = 0.7

// Configurazione WebGL
const webglConfig = {
  context: { depth: false, antialiasing: true },
  texture: {
    src: "/hex.jpg",
    level: false,
    wrap: undefined, // Sarà impostato durante l'inizializzazione
    minMag: undefined // Sarà impostato durante l'inizializzazione
  }
}

class WebGLDemo {
  constructor() {
    this.canvas = document.querySelector("#canvas")
    this.log = document.querySelector("#log")
    this.cover = document.querySelector(".cover")
    this.lastFrameTime = 0
    this.frameCount = 0
    
    // Binding dei metodi
    this.render = this.render.bind(this)
    this.run = this.run.bind(this)
  }

  async initialize() {
    try {
      this.gl = twgl.getContext(this.canvas, webglConfig.context)
      const gpuTier = await getGPUTier()
      
      this.initializeWebGL(gpuTier)
      this.animateCover()
      this.run()
    } catch (err) {
      console.error("Initialization failed:", err)
      throw err
    }
  }

  initializeWebGL(gpuTier) {
    this.gpu = gpuTier
    this.gl = twgl.getContext(this.canvas, webglConfig.context)

    // Configurazione texture
    webglConfig.texture.minMag = this.gl.LINEAR
    webglConfig.texture.wrap = this.gl.REPEAT
    this.texture = twgl.createTexture(this.gl, webglConfig.texture)

    // Creazione framebuffers
    this.framebuffers = {
      fb0: twgl.createFramebufferInfo(this.gl, null),
      fb1: twgl.createFramebufferInfo(this.gl, null),
      fb2: twgl.createFramebufferInfo(this.gl, null)
    }

    // Creazione programmi shader
    this.programs = {
      main: twgl.createProgramInfo(this.gl, [vs, fs]),
      blend: twgl.createProgramInfo(this.gl, [vs, blends]),
      draw: twgl.createProgramInfo(this.gl, [vs, draws])
    }

    // Buffer per la geometria
    this.positionBuffer = twgl.createBufferInfoFromArrays(this.gl, {
      position: {
        data: [-1, -1, -1, 3, 3, -1],
        numComponents: 2
      }
    })
  }

  animateCover() {
    gsap.to(this.cover, {
      duration: 5,
      delay: 1,
      autoAlpha: 0
    })
  }

  run(timestamp = 0) {
    requestAnimationFrame(this.run)
    
    const elapsed = timestamp - this.lastFrameTime
    if (elapsed >= FRAME_INTERVAL) {
      this.lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL)
      this.render(timestamp / 1000)
      this.frameCount++
    }
  }

  render(time) {
    const resolution = this.resizeCanvas()
    this.setupGLState()
    
    // Render nuovo frame
    this.renderNewFrame(time, resolution)
    
    // Blend con frame precedente
    this.blendFrames(time, resolution)
    
    // Render finale
    this.renderFinalFrame(time, resolution)
    
    // Swap framebuffers
    this.swapFramebuffers()
  }

  setupGLState() {
    const { gl } = this
    gl.disable(gl.CULL_FACE)
    gl.disable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  renderNewFrame(time, resolution) {
    const { gl, programs, positionBuffer, texture } = this
    
    gl.useProgram(programs.main.program)
    twgl.setBuffersAndAttributes(gl, programs.main, positionBuffer)
    twgl.setUniforms(programs.main, {
      uTime: time,
      uPatternTexture: texture,
      uResolution: resolution
    })
    twgl.bindFramebufferInfo(gl, this.framebuffers.fb0)
    twgl.drawBufferInfo(gl, positionBuffer)
  }

  blendFrames(time, resolution) {
    const { gl, programs, positionBuffer, framebuffers } = this
    
    gl.useProgram(programs.blend.program)
    twgl.setBuffersAndAttributes(gl, programs.blend, positionBuffer)
    twgl.setUniforms(programs.blend, {
      uTime: time,
      uResolution: resolution,
      uPersistence: DEFAULT_PERSISTENCE,
      newTexture: framebuffers.fb0.attachments[0],
      oldTexture: framebuffers.fb1.attachments[0]
    })
    twgl.bindFramebufferInfo(gl, framebuffers.fb2)
    twgl.drawBufferInfo(gl, positionBuffer)
  }

  renderFinalFrame(time, resolution) {
    const { gl, programs, positionBuffer, framebuffers } = this
    
    gl.useProgram(programs.draw.program)
    twgl.setBuffersAndAttributes(gl, programs.draw, positionBuffer)
    twgl.setUniforms(programs.draw, {
      uTime: time,
      uResolution: resolution,
      uTexture: framebuffers.fb2.attachments[0]
    })
    twgl.bindFramebufferInfo(gl, null)
    twgl.drawBufferInfo(gl, positionBuffer)
  }

  swapFramebuffers() {
    const temp = this.framebuffers.fb1
    this.framebuffers.fb1 = this.framebuffers.fb2
    this.framebuffers.fb2 = temp
  }

  resizeCanvas() {
    const pxr = this.gpu.tier <= 1 ? 1 : dpr
    const { clientHeight, clientWidth } = this.canvas
    
    const width = Math.floor(clientWidth * pxr)
    const height = Math.floor(clientHeight * pxr)
    
    const needsResize = twgl.resizeCanvasToDisplaySize(this.canvas, pxr)
    if (needsResize) {
      this.resizeFramebuffers(width, height)
      this.updateDebugInfo(width, height, pxr)
    }
    
    return [width, height]
  }

  resizeFramebuffers(width, height) {
    const { gl, framebuffers } = this
    Object.values(framebuffers).forEach(fb => {
      twgl.resizeFramebufferInfo(gl, fb, null, width, height)
    })
  }

  updateDebugInfo(width, height, pxr) {
    this.log.innerHTML = `
      ${this.gpu.gpu || "n/d"}<br/>
      tier: ${this.gpu.tier}<br/>
      px.ratio: ${pxr}<br/>
      fps: ${this.gpu.fps}<br/>
      W x H: ${width} ${height}
    `
  }
}

// Inizializzazione
if (import.meta.env.MODE === "development") {
  import("https://greggman.github.io/webgl-lint/webgl-lint.js")
}

const demo = new WebGLDemo()
demo.initialize()