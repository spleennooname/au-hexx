<template>
  <div id="app">
    <canvas id="gl"></canvas>
     <div class="title">AuHE<sup>X</sup><br/><span style="font-size:0.8em">FOR DEVX2018</span></div>
  </div>
 
</template>

<script>
import PATTERN_URL from "../assets/hex-512x512-2.jpg";
import SHADER_HEX from "../glsl/monolith_sqr.glsl";
import SHADER_POST from "../glsl/post.glsl";

export default {
  name: "app",
  data() {
    return {};
  },

  methods: {
    init() {
      SQR.Loader.loadImage(PATTERN_URL, this.sqr);
    },

    has_webgl() {
      try {
        var canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    },

    sqr(pattern) {
      var hash = window.location.hash.substring(1);
      this.scaling = hash !== "" ? parseFloat(hash) : 2;

      this.fps_ms = 1000 / 60;

      this.renderer = SQR.Renderer("#gl", {
        antialias: false
      });

      this.renderer.clearColor(0.0, 0.0, 0.0, 1);
      this.context = this.renderer.context;

      var w = window.innerWidth / this.scaling,
        h = window.innerHeight / this.scaling,
        aspect = w / h;

      this.pattern = new SQR.Texture(pattern, {
        wrap: "REPEAT",
        mipmap: true,
        minFilter: this.context.gl.LINEAR,
        magFilter: this.context.gl.LINEAR
      });

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
        .setUniform("iResolution", new SQR.V2(w, h))
        .setUniform("uPatternTexture", this.pattern);

      this.object3d = SQR.Transform();
      this.object3d.buffer = SQR.Primitives.createPlane(
        4 * aspect,
        4,
        1,
        1,
        0,
        0
      ).update();
      this.object3d.rotation.x = 90 * (Math.PI / 180);
      this.object3d.shader = this.shader;

      this.root.add(this.object3d);

      this.mx = 0;
      this.my = 0;
      this.tx = 0;
      this.ty = 0;
      this.lx = 0;
      this.ly = 0;
      this.cameraz = this.camera.position.z;

      window.addEventListener("resize", this.resize, false);

      this._isInteraction = false;
      if ("ontouchstart" in document) {
        document.addEventListener(
          "touchstart",
          this._onInteractionStart,
          false
        );
        document.addEventListener("touchmove", this._onInteractionMove, false);
        document.addEventListener("touchend", this._onInteractionEnd, false);
      } else {
        document.addEventListener("mousedown", this._onInteractionStart, false);
        document.addEventListener("mousemove", this._onInteractionMove, false);
        document.addEventListener("mouseup", this._onInteractionEnd, false);
      }

      this.resize();

      this.t = 0.0;
      this.then = window.performance.now();
      this.now = 0;
      this.render();
    },

    _onInteractionStart(e) {
      this.cameraz = 1.85;
    },

    _onInteractionEnd(e) {
      this.cameraz = 2.5;
    },

    _onInteractionMove(e) {
      this._normalizeMouseCoords(e);
      TweenMax.killTweensOf(this.camera.position);
      TweenMax.to(this.camera.position, 0.5, {
        z: this.cameraz,
        onComplete: function() {
          this._isInteraction = false;
        }
      });
    },

    _normalizeMouseCoords(e) {
      e = "ontouchstart" in document ? e.targetTouches[0] : e;
      this.mx =
        (e.pageX / window.innerWidth * 2 - 1) *
        (window.innerWidth / window.innerHeight);
      this.my = (e.pageY / window.innerHeight * 2 - 1) * -1;
    },

    resize() {
      var w = window.innerWidth / this.scaling,
        h = window.innerHeight / this.scaling,
        aspect = w / h;

      this.shader.setUniform("iResolution", new SQR.V2(w, h));

      this.rawFBO.resize(w, h);
      this.postFBO.resize(w, h);

      this.renderer.context.size(w, h, window.devicePixelRatio);
      this.camera.projection = new SQR.ProjectionMatrix().perspective(
        70,
        aspect,
        0,
        1000
      );
    },

    render(timestamp) {
      requestAnimationFrame(this.render);

      // calc elapsed time since last loop
      this.now = window.performance.now();
      var delta = this.now - this.then;

      // if enough time has elapsed, draw the next frame
      if (delta > this.fps_ms) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.then = this.now - delta % this.fps_ms;

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

        this.context.gl.viewport(
          0,
          0,
          this.context.canvas.width,
          this.context.canvas.height
        );

        this.post.shader.use();
        this.post.shader.setUniform("uTexture", this.rawFBO.texture);
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
  font-family: "Carrois Gothic SC", sans-serif;

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
  opacity: 1;
  z-index: 1;
}

.title {
  position: fixed;

  font-size: 20px;
  color: white;
  top: 20px;
  left: 20px;
  z-index: 1;
}

#app {
  position: relative;

  width: 100%;
  max-width: 1920px;

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
