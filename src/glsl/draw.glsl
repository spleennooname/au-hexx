
precision highp float;

uniform sampler2D uTexture;

uniform float uTime;
uniform vec2 uResolution;

#define R uResolution
#define time uTime

void main() {
  gl_FragColor = texture2D(uTexture, gl_FragCoord.xy / R.xy);
}
