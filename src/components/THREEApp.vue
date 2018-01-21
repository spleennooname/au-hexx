<template>
  <div id="app">
    <canvas id="gl"></canvas>
  </div>
</template>

<script>

const SHADER = require("../glsl/monolith_three.glsl");
const THREE = require("three");

export default {
  name: "app",

  data() {
    return {
      scaling: 4
    };
  },

  methods: {

    init() {
      
      var w = window.innerWidth,
          h = window.innerHeight,
          aspect = w / h;

      this.canvas = document.getElementById("gl");

      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        canvas: this.canvas
      });

      this.renderer.setPixelRatio( window.devicePixelRatio );

      // this.renderBack1 = new THREE.WebGLRenderTarget(w, h);
      this.scene = new THREE.Scene();
      // this.sceneBack = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
      // this.cameraBack = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
      // this.clock = new THREE.Clock();

      this.uniforms = {
        uTime: {
          type: "f",
          value: 1.0
        },
        iResolution: {
          type: "v2",
          value: new THREE.Vector2(w, h)
        }
      };

      this.material = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          fragmentShader: SHADER,
          vertexShader:`
          varying vec2 vUv;
          void main()	{
            vUv = uv;
            gl_Position = vec4( position, 1.0 );
          }`
        })

      console.log( this.material )

      this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(2, 2), this.material );

      this.scene.add(this.mesh);

      window.addEventListener("resize", this.resize, false);
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);

      this.resize();
      this.render();
    },

    onDocumentMouseMove(event) {},

    resize() {

      var w = window.innerWidth
        h = window.innerHeight,
        aspect = w / h;

      // this.canvas.width = w;
      // this.canvas.height = h;

      // this.cameraBack.aspect = aspect;
      // this.cameraBack.updateProjectionMatrix();

      this.uniforms.iResolution.value.set(w, h);

      // this.renderBack1.setSize(w, h);
      this.renderer.setSize(w, h);
      
    },

    render( time) {

      requestAnimationFrame(this.render);
      //console.log( time )
    
      this.uniforms.uTime.value += 0.1;

      this.renderer.render(this.scene, this.camera);

    }
  },

  mounted() {
    this.$nextTick(this.init);
  }

};
</script>

<style lang="scss">
*,
*:after,
*:before {
  box-sizing: border-box;
}

body,
html {
  width: 100%;
  min-height: 100%;
  height: 100%;
  overflow: hidden;
}

body,
html {
  margin: 0;
  padding: 0;

  position: relative;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  background: black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;
  padding: 0;
  margin: 0;
  background: -webkit-radial-gradient(center ellipse, #fff 50%, #000 100%);
  background: radial-gradient(ellipse at center, #fff 50%, #000 100%);
}

canvas {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
