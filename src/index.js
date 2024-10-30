"use strict";

import "./styles/styles.scss";
import vs from "./glsl/vert.glsl";
import fs from "./glsl/frag.glsl";
import blends from "./glsl/blend.glsl";
import draws from "./glsl/draw.glsl";

import { dpr } from "./utils";
import { getGPUTier } from "detect-gpu";
import { gsap } from "gsap";
import * as twgl from "twgl.js";

const isDev = import.meta.env.MODE === "development";
let gl, fb0, fb1, fb2, tmp, positionBuffer, texture, programInfo, blendInfo, drawInfo;
let gpuTier, canvas, log, cover;
const fpsInterval = 1000 / 50;
let lastRender = 0;

async function demo() {
  cover = document.querySelector(".cover");
  gsap.to(cover, { delay: 1, autoAlpha: 0, duration: 5 });

  canvas = document.querySelector("#canvas");
  log = document.querySelector("#log");

  try {
    gl = canvas.getContext("webgl2");
    gpuTier = await getGPUTier();
    console.table(gpuTier);

    init();
    run();
  } catch (err) {
    throw new Error("Error: " + err.toString());
  }
}

function init() {
  gl = twgl.getContext(canvas, { depth: false, antialias: true });
  texture = twgl.createTexture(gl, {
    src: "/hex.jpg",
    minMag: gl.LINEAR,
    wrap: gl.REPEAT,
  });

  fb0 = twgl.createFramebufferInfo(gl);
  fb1 = twgl.createFramebufferInfo(gl);
  fb2 = twgl.createFramebufferInfo(gl);

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  blendInfo = twgl.createProgramInfo(gl, [vs, blends]);
  drawInfo = twgl.createProgramInfo(gl, [vs, draws]);

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: {
      data: [-1, -1, -1, 3, 3, -1],
      numComponents: 2,
    },
  });
}

function run(time) {
  requestAnimationFrame(run);
  const now = window.performance.now();
  const elapsed = now - lastRender;

  if (elapsed > fpsInterval) {
    lastRender = now - (elapsed % fpsInterval);
    render(now / 1000);
  }
}

function render(time) {
  const [w, h] = resizeCanvasToDisplaySize();

  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw new frame
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texture,
    uResolution: [w, h],
  });
  twgl.bindFramebufferInfo(gl, fb0);
  twgl.drawBufferInfo(gl, positionBuffer);

  // Blend with fb1 into fb2
  gl.useProgram(blendInfo.program);
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer);
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution: [w, h],
    uPersistence: 0.7,
    newTexture: fb0.attachments[0],
    oldTexture: fb1.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, fb2);
  twgl.drawBufferInfo(gl, positionBuffer);

  // Draw fb2 on canvas
  gl.useProgram(drawInfo.program);
  twgl.setBuffersAndAttributes(gl, drawInfo, positionBuffer);
  twgl.setUniforms(drawInfo, {
    uTime: time,
    uResolution: [w, h],
    uTexture: fb2.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, null);
  twgl.drawBufferInfo(gl, positionBuffer);

  // Swap fb1 and fb2
  [fb1, fb2] = [fb2, fb1];
}

function resizeCanvasToDisplaySize() {
  const dpr = Math.min(gpuTier.tier, window.devicePixelRatio);

  const { clientWidth: w, clientHeight: h } = canvas;

  const needsResize = twgl.resizeCanvasToDisplaySize(canvas, dpr);
  if (needsResize) {
    twgl.resizeFramebufferInfo(gl, fb0, null, w, h);
    twgl.resizeFramebufferInfo(gl, fb1, null, w, h);
    twgl.resizeFramebufferInfo(gl, fb2, null, w, h);

    //const maxw = gpuTier.tier <= 1 ? 512 : gpuTier.tier === 2 ? 640 : canvas.clientWidth;
    //canvas.style.maxWidth = `${maxw}px`;

    log.innerHTML = `${gpuTier.gpu || "n/d"}<br/>
                    Tier: ${gpuTier.tier}<br/>
                    pxRatio: ${dpr}<br/>
                    fps: ${gpuTier.fps || "n/a"}<br/>
                    WxH: ${w} x ${h}`;
  }

  return [w, h];
}

demo();