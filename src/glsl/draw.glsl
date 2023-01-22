
precision highp float;

uniform sampler2D uTexture;

uniform float uTime;
uniform vec2 uResolution;

#define R uResolution
#define time uTime

void main() {
  vec2 uv = gl_FragCoord.xy / R.xy;
  gl_FragColor = texture2D(uTexture, uv);
}
