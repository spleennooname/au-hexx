<template>
  <div id="app">
    <canvas id="gl"></canvas>
    <div class="title">AuHE<sup>X<sup>X</sup></sup><br/><span style="font-size:0.8em"></span></div>
    <transition name="fade" mode="out-in">
        <div class="cover" v-if="cover == 1">
            <blockquote>&laquo;i've spent, I think, close to the last decade effortlessly and magically converting your tin cans into pure gold.&raquo;</blockquote><br/>
            <span>Charlie Sheen</span>
        </div>
    </transition>
  </div>
 
</template>

<script>
import PATTERN_URL from "../assets/hex-512x512-2.jpg";
import SHADER_HEX from "../glsl/monolith_sqr.glsl";
import SHADER_POST from "../glsl/post.glsl";

const Pressure = require("pressure");

export default {
  name: "app",
  data() {
    return {
      cover: 1,
      uForce: 0.0
    };
  },

  methods: {
    init() {
      if (this.has_webgl()) {
        SQR.Loader.loadImage(PATTERN_URL, this.sqr);
      }
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
      this.scaling = hash !== "" ? parseFloat(hash) : 1.5;

      this.fps_ms = 1000 / 60;

      this.renderer = SQR.Renderer("#gl", {
        antialias: true,
        transparent: true
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
      //this.trackball = new SQR.Trackball();

      //root
      this.root = SQR.Transform();
      this.root.isStatic = true;
      this.root.add(this.camera);

      this.uForce = 1.0;

      this.shader = SQR.Shader(SHADER_HEX)
        .use()
        .setUniform("iResolution", new SQR.V2(w, h))
        .setUniform("uPatternTexture", this.pattern)
        .setUniform("uForce", this.uForce);

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
        // document.addEventListener(
        //   "touchstart",
        //   this._onInteractionStart,
        //   false
        // );
        // document.addEventListener("touchmove", this._onInteractionMove, false);
        // document.addEventListener("touchend", this._onInteractionEnd, false);
      } else {
        document.addEventListener("mousedown", this._onInteractionStart, false);
        document.addEventListener("mousemove", this._onInteractionMove, false);
        document.addEventListener("mouseup", this._onInteractionEnd, false);
      }

     
      Pressure.set("#app", {
        start: function(event) {
          // this is called on force start
          //console.log("start")
        },
        end: this._interaction_end,
        startDeepPress: function(event) {
          // this is called on "force click" / "deep press", aka once the force is greater than 0.5
        },
        endDeepPress: function() {
          // this is called when the "force click" / "deep press" end
        },
        change: this._interaction_change
      });

      this.cover = 0;
     
      this.resize();

      this.t = 0.0;
      this.then = window.performance.now();
      this.now = 0;
      this.render();
    },

    _interaction_change(force, event) {

     this.uForce = force;
     //console.log("force in", force)
     //this.shader.setUniform("uForce", force);
    },

   _interaction_update( shader, tween, prop) {
               // console.log("force out", tween.target[prop])
                //shader.setUniform("uForce", tween.target[prop]);
        this.uForce = tween.target[prop]
     },

    _interaction_end(){
      //console.log("end")

          this.tweenForce = {
            value: this.uForce
          }

           TweenMax.to(this.tweenForce, 0.35, {
              value: 0,
              onUpdateParams:[ this.shader, "{self}", "value"],
              onUpdate: this._interaction_update
            });
    },

    _onInteractionStart(e) {
      this._isInteraction = true;

      this._normalizeMouseCoords(e);
      this.cameraz = 1.85;

       TweenMax.to(this.camera.position, 0.5, {
        z: this.cameraz,
        onComplete: function() {

        }
      });
    },

    _onInteractionEnd(e) {
      this._isInteraction = false;

      this._normalizeMouseCoords(e);
      this.cameraz = 2.5;

       TweenMax.to(this.camera.position, 0.5, {
        z: this.cameraz,
        onComplete: function() {

        }
      });
    },

    _onInteractionMove(e) {
      this._normalizeMouseCoords(e);

      var d = Math.sqrt(this.mx * this.mx + this.my * this.my);
      //console.log(d)
      this.shader.setUniform("u_param", 0.0);

      if (this._isInteraction) {
      }
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
      this.camera.projection = new SQR.ProjectionMatrix().perspective( 70, aspect, 0, 1000 );
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

        //console.log("****", this.uForce)
       
        this.rawFBO.bind();
         
        this.renderer.render(this.root, this.camera);
  this.shader.setUniform("uForce", this.uForce);
        this.postFBO.bind();
        this.renderer.renderToScreen();
        this.context.gl.viewport( 0, 0, this.context.canvas.width, this.context.canvas.height );

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

.fade-enter-active{
  -webkit-transition: opacity 8.0s ease-out;
  transition: opacity 8.0s ease-out
}
.fade-leave-active {
  -webkit-transition: opacity 4s ease-out 15s;
  transition: opacity 4s ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}


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

.cover{
  position: fixed;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  color: white;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.25rem;
  z-index: 666;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .85);

  > blockquote{
    width: 60vw;
  }
  > span{
    font-size: 0.85rem;
  }

}
</style>
