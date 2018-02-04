
const fs = require("./glsl/twgl/vs.glsl");
const vs = require("./glsl/twgl/fs.glsl");

"use strict";

const gl = document.querySelector("#gl").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const arrays = { position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0], };
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);



const scaling = 4;
const fps_ms = 1000 / 60;
let then = window.performance.now();
let now = 0;

let w = window.innerWidth;
let h = window.innerHeight;
let t = 0.0;

function render(time) {

  requestAnimationFrame(render);

  now = window.performance.now();
  let delta = now - then;

  if (delta > fps_ms) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (delta % fps_ms);

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, w, h);

    t += 0.001;
    const uniforms = {
      uTime: t, 
      iResolution: [w, h],
    };
    
    console.log( t )

    gl.useProgram(programInfo.program);
    
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

  }

}




render();
