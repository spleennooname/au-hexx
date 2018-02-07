<template>
  <div id="app">
    <canvas id="gl"></canvas>
  </div>
</template>

<script>

import PATTERN_URL from "../assets/hex-512x512-2.jpg"
import SHADER_HEX from "../glsl/monolith_sqr.glsl";
import SHADER_POST from "../glsl/post.glsl";

export default {
  name: "app",
  data() {
    return {
      
    };
  },

  methods: {
    
    init(){  
      SQR.Loader.loadImage( PATTERN_URL, this.sqr);
    },

    sqr( pattern ) {

      this.scaling = 2 ;

      this.fps_ms = 1000/ 60;

      this.renderer = SQR.Renderer("#gl", {
        antialias: false
      });

      this.renderer.clearColor(0.0, 0.0, 0.0, 1);
      this.context = this.renderer.context;

      var w = window.innerWidth / this.scaling,
          h = window.innerHeight / this.scaling,
          aspect = w / h;
      
      
      this.pattern = new SQR.Texture( pattern, {
        wrap: "REPEAT",
        mipmap: true,
        minFilter: this.context.gl.LINEAR,
        magFilter: this.context.gl.LINEAR
      } );

      this.rawFBO = SQR.FrameBuffer();
      this.postFBO = SQR.FrameBuffer();

      this.post = SQR.Primitives.createPostEffect(SHADER_POST);

      //camera
      this.camera = SQR.Transform();
      this.camera.position.z = 2.5;
      this.camera.isStatic = false;
      this.camera.useQuaternion = true;

      //trackball
      this.trackball = new SQR.Trackball();

      //root
      this.root = SQR.Transform();
      this.root.isStatic = true;
      this.root.add(this.camera);

      this.shader = SQR.Shader(SHADER_HEX)
        .use()
        .setUniform(
          "iResolution",
          new SQR.V2(w, h)
        )
        .setUniform(
          "uPatternTexture",
          this.pattern
        );

      this.object3d = SQR.Transform();
      this.object3d.buffer = SQR.Primitives.createPlane( 4 * aspect, 4, 1, 1, 0, 0 ).update();
      this.object3d.rotation.x = 90 * ( Math.PI / 180 );
      this.object3d.shader = this.shader;

      this.root.add(this.object3d);

      this.mx = 0;
      this.my = 0;
      this.tx = 0;
      this.ty = 0;
      this.lx = 0;
      this.ly = 0;

   
      var event = 'ountouchstart' in window ? 'touchmove' : 'mousemove';
      window.addEventListener("resize", this.resize, false);
      document.addEventListener( event, this.move, false);

      this.resize();

      this.then = window.performance.now();
      this.now = 0;
      this.render();

    },

    move(e) {
      e.preventDefault();
      e = e.targetTouches ? e.targetTouches[0] : e;
      this.tx = (e.pageX / window.innerWidth) * 2 - 1;
      this.ty = (e.pageY / window.innerHeight) * 2 - 1;
    },

    resize() {
      var w = window.innerWidth / this.scaling,
        h = window.innerHeight / this.scaling,
        aspect = w / h;

      this.shader.setUniform("iResolution", new SQR.V2(w, h) );

      this.rawFBO.resize(w, h);
      this.postFBO.resize(w, h);

      this.renderer.context.size( w ,h, window.devicePixelRatio );
      this.camera.projection = new SQR.ProjectionMatrix().perspective( 70, aspect, 0, 1000 );
    },

    render( timestamp ) {

      requestAnimationFrame(this.render);

      // calc elapsed time since last loop
      this.now =  window.performance.now();
      var delta = this.now - this.then;

      // if enough time has elapsed, draw the next frame
      if ( delta > this.fps_ms ) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.then = this.now - ( delta % this.fps_ms );

        
        // this.mx += (this.tx -this.mx) * 0.005;

        // if (Math.abs(this.mx) < 0.15)
        //   this.camera.rotation.z = this.mx * Math.PI / 4;

        // this.my += (this.ty - this.my) * 0.005;

        // if (Math.abs(this.my) < 0.15)
        //    this.camera.rotation.x = this.my * Math.PI / 4;

        //this.camera.quaternion.copyFrom(this.trackball.rotation);
    
        this.rawFBO.bind();
        this.renderer.render(this.root, this.camera);

        this.postFBO.bind();
        this.renderer.renderToScreen();

        this.context.gl.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.post.shader.use();
        //post.shader.setUniform('iResolution', size);
        this.post.shader.setUniform('uTexture', this.rawFBO.texture);
        this.renderer.render(this.post);

       
      }

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

  
  max-height: 960px;

  pointer-events: none;
  // background-color: grey;
  opacity: 1.0;
  z-index: 1;
}

#app {
  position: relative;
 
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  // background: red
}
</style>
