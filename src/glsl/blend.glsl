
precision highp float;

uniform sampler2D newTexture;
uniform sampler2D oldTexture;

uniform float uTime;
uniform vec2 uResolution;

#define R uResolution
#define time uTime

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;

  gl_FragColor = mix( texture2D(newTexture, uv), texture2D(oldTexture, uv), .75);
}
