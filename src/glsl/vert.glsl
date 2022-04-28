precision highp float;

uniform float uTime;

uniform float loudness;
uniform float perceptualSharpness;
uniform float perceptualSpread;
uniform float spectralFlatness;
uniform float spectralKurtosis; 

attribute vec3 position;

varying vec3 vCameraPos;
varying mat3 vRotation;

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

  float xt = floor(time * .5) + clamp(fract(time * .5) * 1., 0., 1.);
  float yt = floor(time * .5) + clamp(fract(time * .5) * 1., 0., 1.);
  
  float zt = time * 0.4;

  vRotation = rotateX(xt * PI * .25) * rotateY(yt * PI * .25) * rotateZ(zt * PI);

  vCameraPos = vec3(
    -6., 
    -4., 
    cos(time)
  );

  gl_Position = vec4(position, 1.0);
}
