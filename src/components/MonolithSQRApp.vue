<template>
  <div id="app">
    <canvas id="gl"></canvas>
  </div>
</template>

<script>

const SHADER = require("../glsl/monolith_sqr.glsl");

export default {
  name: "app",
  data() {
    return {
      
    };
  },

  methods: {
    
    sqr() {

      this.scaling = 4 ;

      this.renderer = SQR.Renderer("#gl", {
        antialias: false,
        preserveDrawingBuffer: false
      });

      this.renderer.clearColor(0.0, 0.0, 0.0, 1);

      var w = window.innerWidth / this.scaling,
          h = window.innerHeight / this.scaling,
          aspect = w / h;

      //camera
      this.camera = SQR.Transform();
      this.camera.position.z = 2.5;
      this.camera.isStatic = true;

      //root
      this.root = SQR.Transform();
      this.root.isStatic = true;
      this.root.add(this.camera);

      this.shader = SQR.Shader(SHADER)
        .use()
        .setUniform(
          "iResolution",
          new SQR.V2(w, h)
        );

      //this.shader = SQR.Shader( SQR.GLSL.normal2color ).use();

      this.object3d = SQR.Transform();
      this.object3d.buffer = SQR.Primitives.createPlane( 4 * aspect, 4, 1, 1, 0, 0 ).update();
      this.object3d.rotation.x = Math.PI / 2;
      this.object3d.shader = this.shader;

      this.root.add(this.object3d);

      this.then = Date.now();
      this.now = 0;

      this.mouseX= 0;
      this.mouseY= 0;

      window.addEventListener("resize", this.resize, false);
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);

      this.resize();
      this.render();
    },

    onDocumentMouseMove(event) {

      event.preventDefault();

      var w = window.innerWidth / 1,
        h = window.innerHeight / 1;

      this.mouseX = event.clientX - w / 2;
      this.mouseY = event.clientY - h / 2;

      console.log("onDocumentMouseMove", event.clientX,event.clientY);

    },

    resize() {
      var w = window.innerWidth / this.scaling,
        h = window.innerHeight / this.scaling,
        aspect = w / h;
      this.shader.setUniform("iResolution", new SQR.V2(w, h));

      this.renderer.context.size( w ,h, window.devicePixelRatio );
      this.camera.projection = new SQR.ProjectionMatrix().perspective( 70, aspect, 0, 1000 );
    },

    render() {
      requestAnimationFrame(this.render);

      //this.now = Date.now();
      //var delta = this.now - this.then;

      //if (delta > (1000 /60)) {

      this.targetX = this.mouseX * .001;
      this.targetY = this.mouseY * .001;

      this.object3d.rotation.y += 0.005 * ( this.targetY - this.object3d.rotation.y );
      //this.object3d.rotation.x -= 0.005 * ( this.targetX - this.object3d.rotation.x );
      this.renderer.render(this.root, this.camera);

      // this.then = this.now - (delta % (1000 / 60));
      // }
    }
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
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  // background-color: grey;
  opacity: 0.75;
  z-index: 1;
  max-width: 100%;
}

#app {
  position: relative;
  max-height: 1280px;
  max-height: 720px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  
}
</style>
