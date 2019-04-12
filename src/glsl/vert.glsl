precision highp float;

uniform float uTime;

attribute vec3 position;

varying vec3 cameraPos;
varying mat3 rotation;

#define time uTime
#define PI 3.1415

mat3 rotateX(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(1., 0., 0., 0., c, -s, 0., s, c);
}

mat3 rotateY(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(c, 0., -s, 0., 1., 0., s, 0., c);
}

mat3 rotateZ(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

void main() {

  float xt = floor(time * .5) + clamp(fract(time * .5) * 5., 0., 1.);
  float yt = floor(time * .5) + clamp(fract(time * .5) * 5., 0., 1.);
  float zt = time * 0.1;

  rotation = rotateX(xt * PI * .5) * rotateY(yt * PI * .5) * rotateZ(zt * PI);

  cameraPos = vec3(-9., 5. * sin(time * .5), -1. * sin(time * .25) / time);

  gl_Position = vec4(position, 1.0);
}
