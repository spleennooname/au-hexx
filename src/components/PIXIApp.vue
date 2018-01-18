<template>
  <div id="app">
    <canvas id="gl"></canvas>
  </div>
</template>

<script>

const SHADER = require('../glsl/monolith_pixi.glsl');

export default {
  name: "app",
  data() {
    return {
      scaling: 3
    };
  },

  methods: {

    init() {

      var w= window.innerWidth,
          h = window.innerHeight;

      this.renderer = PIXI.autoDetectRenderer({
        width: w,
        height: h,
        forceFXAA: true,
        legacy: true,
        transparent: true,
        view: document.querySelector("#gl"),
        backgroundColor : 0x000000 
      });

      this.filter = new PIXI.Filter(null, SHADER, {
        iResolution: {
          type: 'v2',
          value: [w, h]
        },
        uTime:{
          type: "f",
          value: 0
        }
      });
      this.filter.autoFit = true;
      this.filter.resolution = 0.5;
      this.filter.padding = 10.5;

      this.stage = new PIXI.Container();
      this.sprite = new PIXI.Sprite();
  
      this.sprite.width = w;
      this.sprite.height = h;
     
      this.sprite.filters = [this.filter];

      this.stage.addChild(this.sprite);
     
      this.then = Date.now();
      this.now = 0;

      window.addEventListener("resize", this.resize, false);
      this.resize();
      this.render();

    },

    resize(){
      // Get new width and height
      var w= window.innerWidth,
          h = window.innerHeight;

      // Update uniform
      this.filter.uniforms.iResolution[0] = w;
      this.filter.uniforms.iResolution[1] = h;

      // Full screen sprite
      this.sprite.width = w;
      this.sprite.height = h;

      // Resize renderer
      this.renderer.resize(w, h);
  
    },

    render() {

      requestAnimationFrame(this.render);

      this.filter.uniforms.uTime += 0.5;

      this.renderer.render(this.stage);

    },

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
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#app{
  width: 100%;
  height: 100%;
}
</style>
