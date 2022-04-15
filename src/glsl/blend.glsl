
precision highp float;

uniform sampler2D newTexture;
uniform sampler2D oldTexture;

uniform float uTime;
uniform vec2 uResolution;
uniform float uPersistence;

#define R uResolution
#define time uTime

void main() {
  vec2 uv = gl_FragCoord.xy / R.xy;
  vec4 c = mix( texture2D(newTexture, uv), texture2D(oldTexture, uv), uPersistence);
  gl_FragColor = c;
}
