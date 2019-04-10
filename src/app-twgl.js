'use strict';

import './styles/styles.scss';

import vs from './glsl/vert.glsl';
import fs from './glsl/hex.glsl';
import ps from './glsl/post.glsl';

import { getGPUTier } from 'detect-gpu';
import { TweenMax } from 'gsap';
import * as twgl from 'twgl.js';

let canvas,
    gl,
    GPUTier,
    positionBuffer,
    fb1,
    fb2,
    temp,
    rafID = -1,
    pixelRatio = 0,
    texture,
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

function getBestPixelRatio() {
  return GPUTier.tier.indexOf('MOBILE_TIER_0') !== -1 || (GPUTier.tier.indexOf('MOBILE_TIER_1') !== -1 && window.devicePixelRatio > 1) ? 1 : window.devicePixelRatio;
}

function getBestFPS() {
  return GPUTier.tier.indexOf('MOBILE_TIER_1') !== -1 && window.devicePixelRatio >= 1 ? 40 : 60;
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

  canvas.addEventListener( 'webglcontextlost', event => {
      console.warn('lost');
      event.preventDefault();
      stop();
    },
    false
  );

  canvas.addEventListener( 'webglcontextrestored', event => {
      console.warn('restored');
      init();
    },
    false
  );

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

  TweenMax.to(document.querySelector('.cover'), 5, { delay: 1, autoAlpha: 0 });

  init();
  //gl.getExtension('WEBGL_lose_context').restoreContext();
  //gl.getExtension('WEBGL_lose_context').loseContext();
}

function init() {
  GPUTier = getGPUTier({
    mobileBenchmarkPercentages: [15, 35, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
    desktopBenchmarkPercentages: [10, 40, 30, 20], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
  });


  pixelRatio = getBestPixelRatio();

  fps = getBestFPS();
  interval = 1000 / fps;

 /*  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement); */

  gl = twgl.getContext(canvas, { depth: false, antialiasing: false });

  texture = twgl.createTextures(gl, {
    pattern: { src: './hex.jpg', mag: gl.NEAREST, min: gl.LINEAR, wrap: gl.REPEAT }
  });

  fb1 = twgl.createFramebufferInfo(gl, null, SIZE, SIZE);
  fb2 = twgl.createFramebufferInfo(gl, null, SIZE, SIZE);

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  postInfo = twgl.createProgramInfo(gl, [vs, ps]);

  positionBuffer = twgl.createBufferInfoFromArrays(gl, {
    position: { data: [-1, -1, -1, 4, 4, -1], numComponents: 2 },
  });

  // -----

  flag = false;

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: 0,
    uPatternTexture: texture.pattern,
    uResolution: [displayWidth, displayHeight],
  });
  twgl.bindFramebufferInfo(gl, fb1);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

   /*document.querySelector('.log').innerHTML =
     'devicePixelRatio=' + window.devicePixelRatio + ', applied: ' + getBestPixelRatio() + ' tier=' + GPUTier.tier + ' type=' + GPUTier.type
   + '<br/>' + window.innerWidth
   + '<br/>' + canvas.width
   + '<br/>' + canvas.clientWidth*/

  run();
}

function run() {
  now = window.performance.now();
  let delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    let t = now / 1000;
    //stats.begin();
    render(t);
    //stats.end();
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
   // console.log(canvas.clientWidth, gl.drawingBufferHeight, gl.canvas.width);
  }
}

function render(time) {

  resize();

  gl.useProgram(programInfo.program);

  twgl.setBuffersAndAttributes(gl, programInfo, positionBuffer);
  twgl.setUniforms(programInfo, {
    uTime: time,
    uPatternTexture: texture.pattern,
    uTexture: fb1.attachments[0],
    uResolution: [displayWidth, displayHeight],
  });
  twgl.bindFramebufferInfo(gl, fb2);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  gl.useProgram(postInfo.program);
  twgl.setBuffersAndAttributes(gl, postInfo, positionBuffer);
  twgl.setUniforms(postInfo, {
      uResolution: [displayWidth, displayHeight],
      uTexture: fb2.attachments[0],
  });
  twgl.bindFramebufferInfo(gl, null);
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLES);

  // ping-pong buffers
  temp = fb1;
  fb1 = fb2;
  fb2 = temp;

  //flag = !flag;
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

demo();
