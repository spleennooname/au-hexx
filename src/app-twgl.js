'use strict';

import './styles/styles.scss';

import vs from './glsl/vert.glsl';
import fs from './glsl/hex.glsl';
import blends from './glsl/blend.glsl';
import draws from './glsl/draw.glsl';

import GPUTools from './GPUTools';
import { TweenMax } from 'gsap';
import * as twgl from 'twgl.js';

const IS_LOG = true;

let canvas,
  gl,
  gpuTools,
  positionBuffer,
  fb0,
  fb1,
  fb2,
  tmp,
  rafID = -1,
  pixelRatio = 0,
  texturePattern,
  displayWidth,
  displayHeight,
  programInfo,
  drawInfo,
  blendInfo,
  stats;

let mouse = [];

let now = 0,
  t = 0,
  then = 0,
  fps = 60,
  interval = 1000 / fps,
  flag = false;

let bufferSize = 512;

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

  document.body.addEventListener(
    'touchmove',
    event => {
      event.preventDefault();
    },
    false
  );

  canvas.addEventListener('webglcontextlost', lost, false);
  canvas.addEventListener('webglcontextrestored', restore, false);

  canvas.addEventListener('mousemove', setMousePos);

  canvas.addEventListener('mouseleave', () => {
    mouse = [0.5, 0.5];
  });

  canvas.addEventListener('mousedown', e => {
    console.log(e);
  });

  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('touchstart', handleTouch, { passive: false });
  canvas.addEventListener('touchmove', handleTouch, { passive: false });

  initGL();

  TweenMax.to(document.querySelector('.cover'), 5, {
    /*  onStart: () => { initGL() }, */
    delay: 1,
    autoAlpha: 0,
  });

  //gl.getExtension('WEBGL_lose_context').restoreContext();
  //gl.getExtension('WEBGL_lose_context').loseContext();
}

function initGL() {
  gpuTools = new GPUTools();

  const gpu = gpuTools.getBestGPUSettings();
  bufferSize = gpu.bufferSize;
  fps = gpu.fps;
  pixelRatio = gpu.ratio;

  interval = 1000 / fps;

  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement);

  gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

  texturePattern = twgl.createTexture(gl, {
    src: './hex.jpg',
    level: false,
    minMag: gl.LINEAR,
    wrap: gl.REPEAT,
  });

  fb0 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize);
  fb1 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize);
  fb2 = twgl.createFramebufferInfo(gl, null, bufferSize, bufferSize);

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  blendInfo = twgl.createProgramInfo(gl, [vs, blends]);
  drawInfo = twgl.createProgramInfo(gl, [vs, draws]);

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: { data: [-1, -1, -1, 4, 4, -1], numComponents: 2 },
  });

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
  // Lookup the bufferSize the browser is displaying the canvas in CSS pixels
  // and compute a bufferSize needed to make our drawingbuffer match it in
  // device pixels.
  const displayAspectRatio = window.innerWidth / window.innerHeight;

  displayWidth = Math.floor(bufferSize);
  displayHeight = Math.floor(bufferSize);

  // Check if the canvas is not the same bufferSize.
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Make the canvas the same bufferSize
    canvas.width = displayHeight;
    canvas.height = displayHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}

function render(time) {
  resize();

  //www.youtube.com/watch?v=rfQ8rKGTVlg#t=31m42s THXX GREGGMANN!!!

  https: // draw new frame
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texturePattern,
    uResolution: [displayWidth, displayHeight],
  });
  twgl.bindFramebufferInfo(gl, fb0);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  // blend new frame with fb1 in fb2
  gl.useProgram(blendInfo.program);
  twgl.setBuffersAndAttributes(gl, blendInfo, positionBuffer);
  twgl.setUniforms(blendInfo, {
    uTime: time,
    uResolution: [displayWidth, displayHeight],
    newTexture: fb0.attachments[0],
    oldTexture: fb1.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, fb2);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  // draw in canvas
  gl.useProgram(drawInfo.program);
  twgl.setBuffersAndAttributes(gl, drawInfo, positionBuffer);
  twgl.setUniforms(drawInfo, {
    uTime: time,
    uResolution: [displayWidth, displayHeight],
    uTexture: fb2.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, null);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  tmp = fb1;
  fb1 = fb2;
  fb2 = tmp;

  if (IS_LOG) {
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
      ')';
  }
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
