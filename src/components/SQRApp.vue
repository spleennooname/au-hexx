<template>
  <div id="app">
    <canvas id="gl"></canvas>
  </div>
</template>

<script>

const SHADER = require('../glsl/monolith_sqr.glsl');

export default {
  name: "app",
  data() {
    return {
      scaling: 4
    };
  },

  methods: {
    sqr() {

      this.renderer = SQR.Renderer("#gl", {
        antialias: false
      })
      
      this.renderer.clearColor(0.0, 0.0, 0.0, 1);

			var w = window.innerWidth,
          h = window.innerHeight,
          aspect = w/h;
          
      //camera
      this.camera = SQR.Transform();
			this.camera.position.z = 2.5;

      //root
      this.root = SQR.Transform();
      this.root.add(this.camera);

      this.shader = SQR.Shader( SHADER ).use().setUniform('iResolution', new SQR.V2(w, h));

      //this.shader = SQR.Shader( SQR.GLSL.normal2color ).use();

      this.object3d = SQR.Transform();
      this.object3d.buffer = SQR.Primitives.createPlane(4*(w/h), 4, 1, 1, 0, 0).update();
      this.object3d.rotation.x = Math.PI / 2;
      this.object3d.shader = this.shader;

      this.root.add(this.object3d);

      this.then = Date.now();
      this.now = 0;

      window.addEventListener("resize", this.resize, false);
      document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
      
      this.resize();
      this.render();
    },

    onDocumentMouseMove( event ) {
      this.mouseX = event.clientX - window.innerWidth/2;
      this.mouseY = event.clientY - window.innerHeight/2;
    },

    resize(e) {

      // if () {
      //   return;
      // }

      var w = window.innerWidth,
          h = window.innerHeight, aspect = w/h;

      this.shader.setUniform('iResolution', new SQR.V2(w, h));

      this.renderer.context.size(w / this.scaling, h / this.scaling, window.devicePixelRatio);
      this.camera.projection = new SQR.ProjectionMatrix().perspective(75, aspect, 1, 1000);
    },

     render() {

      requestAnimationFrame(this.render);

      this.now = Date.now();
      var delta = this.now - this.then;

      if (delta > (1000 /60)) {
        this.renderer.render(this.root, this.camera);
        this.then = this.now - (delta % (1000 / 60));
      }

    },

  },

  mounted() {
    this.$nextTick(this.sqr);
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
}

canvas {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
    background: red;
}

#app{
  width: 100%;
  height: 100%;
}
</style>
