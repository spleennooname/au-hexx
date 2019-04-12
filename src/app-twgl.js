'use strict';

import './styles/styles.scss';

import vs from './glsl/vert.glsl';
import fs from './glsl/hex.glsl';
import ps from './glsl/post.glsl';

import { getGPUTier } from 'detect-gpu';
import { TweenMax } from 'gsap';
import * as twgl from 'twgl.js';

const IS_LOG = true;

let canvas,
  gl,
  GPUTier,
  positionBuffer,
  fb1,
  fb2,
  tmp,
  rafID = -1,
  pixelRatio = 0,
  texturePattern,
  displayWidth,
  displayHeight,
  programInfo,
  postInfo,
  stats;

let mouse = [];

let now = 0,
  t = 0,
  then = 0,
  fps = 60,
  interval = 1000 / fps,
  flag = false;

let SIZE = 512;
// utils

function getGPU() {
  const a = GPUTier.tier.split("_");
  return {
    levelTier: parseInt(a[3], 10),
    isMobile: a.findIndex(k => k === 'MOBILE') !== -1,
    isDesk: a.findIndex(k => k === 'DESKTOP') !== -1
  };
}

function getBestPixelRatio() {
  let ratio = 1;
  let gpu = getGPU();
  if (window.devicePixelRatio > 1 && gpu.isMobile && gpu.levelTier === 2 ) pxratio =  1.25;
  if (window.devicePixelRatio > 1 && gpu.isMobile && gpu.levelTier > 2) pxratio = window.devicePixelRatio
  return ratio;
}

function getBestFPS() {
  let fps = 33;
  let gpu = getGPU();
  if (gpu.isMobile && gpu.levelTier <= 1) {
    SIZE = 320;
    fps = 33;
  }
  else
  if (gpu.isMobile && gpu.levelTier >= 2) {
    fps = 60;
    SIZE = 512;
  }
  else
  if (gpu.isDesk && gpu.levelTier >= 1) {
    fps = 60;
    SIZE = 512;
  }
  return fps;
}

function setMousePos(e) {
  mouse[0] = e.clientX / gl.canvas.clientWidth;
  mouse[1] = 1 - e.clientY / gl.canvas.clientHeight;
}

 function handleTouch(e) {
    e.preventDefault();
    setMousePos(e.touches[0]);
  }

function demo() {
  canvas = document.querySelector('#canvas');

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (err) {
    console.warn('no WebGL in da house.');
    return;
  }

  if (!gl) {
    throw 'no WebGL in da house.';
    return;
  }

  document.body.addEventListener('touchmove', event => {
    event.preventDefault();
  }, false);

  canvas.addEventListener( 'webglcontextlost', lost, false);
  canvas.addEventListener( 'webglcontextrestored', restore, false);

  canvas.addEventListener('mousemove', setMousePos);

  canvas.addEventListener('mouseleave', () => {
    mouse = [0.5, 0.5]
  });

  canvas.addEventListener('mousedown', e => {
    console.log(e)
  });

  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('touchstart', handleTouch, {passive: false});
  canvas.addEventListener('touchmove', handleTouch, { passive: false });

  initGL();

  TweenMax.to(document.querySelector('.cover'), 5, {
   /*  onStart: () => { initGL() }, */
    delay: 1,
    autoAlpha: 0
  });

  //gl.getExtension('WEBGL_lose_context').restoreContext();
  //gl.getExtension('WEBGL_lose_context').loseContext();
}

function initGL() {

  GPUTier = getGPUTier({
    mobileBenchmarkPercentages: [15, 35, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
    desktopBenchmarkPercentages: [15, 35, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
  });

  pixelRatio = getBestPixelRatio();
  fps = getBestFPS();

  interval = 1000 / fps;

  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement);

  gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

  texturePattern = twgl.createTexture(gl, {
    src: './hex.jpg', mag: gl.NEAREST, min: gl.LINEAR, wrap: gl.REPEAT,
  });

  fb1 = twgl.createFramebufferInfo(gl, null, SIZE, SIZE);
  fb2 = twgl.createFramebufferInfo(gl, null, SIZE, SIZE);

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  postInfo = twgl.createProgramInfo(gl, [vs, ps]);

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: { data: [-1, -1, -1, 4, 4, -1], numComponents: 2 },
  });

  // 1st draw, fb1

  flag = false;

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: 0,
    uTexture: twgl.createTexture(gl),
    uPatternTexture: texturePattern,
    uResolution: [displayWidth, displayHeight],
  });
  twgl.bindFramebufferInfo(gl, fb1);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  if (IS_LOG) {
    document.querySelector('.log').innerHTML =
      'devicePixelRatio=' +
      window.devicePixelRatio +
      ' tier=' +
      GPUTier.tier +
      ' type=' +
      GPUTier.type +
      '<br/>' +
      'applied: ' +
      'px ratio: ' +
      pixelRatio +
      ', fps: ' +
      fps +
      '<br/>' +
      '('+window.innerWidth + "," + window.innerHeight +")" +
      '<br/>' +
      '('+canvas.width + "," + canvas.height +")" +
      '<br/>' +
      '(buffer size: ' + SIZE +")"
  }

  run();
}

function run() {
  now = window.performance.now();
  let delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    let t = now / 1000;
    stats.begin();
    render(t);
    stats.end();

  }
  rafID = requestAnimationFrame(run);
}

function resize() {
  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  //const aspectRatio = window.innerWidth / window.innerHeight;
  //console.log( aspectRatio)
  displayWidth = SIZE//Math.floor(canvas.clientWidth * pixelRatio);
  displayHeight = SIZE; //Math.floor(canvas.clientHeight * pixelRatio);
  // Check if the canvas is not the same size.
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same size
    canvas.width = displayHeight;
    canvas.height = displayHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}

function render(time) {

  resize();

  // draw fb1 1st step in fb2
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texturePattern,
    uTexture: fb1.attachments[0],
    uResolution: [displayWidth, displayHeight],
  });
  twgl.bindFramebufferInfo(gl, fb2);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  // draw fb1 in fb2
  gl.useProgram(postInfo.program);
  twgl.setBuffersAndAttributes(gl, postInfo, positionBuffer);
  twgl.setUniforms(postInfo, {
    uTime: time,
    uResolution: [displayWidth, displayHeight],
    uTexture: fb1.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, null);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  // ping-pong buffers
  tmp = fb1;
  fb1 = fb2;
  fb2 = tmp;

}

function start() {
  stop();
  then = window.performance.now();
  run();
}

function stop() {
  rafID = cancelAnimationFrame(run);
}

function destroy() {
  stop();
}

function lost(e) {
   console.warn('lost');
   event.preventDefault();
   stop();
}

function restore(e) {
  console.warn('restored');
  initGL();
}

demo();
