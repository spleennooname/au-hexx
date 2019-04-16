

precision highp float;
precision lowp int;

uniform sampler2D uTexture;
uniform sampler2D uCamTexture;
uniform vec2 uResolution;
uniform float uTime;

#define luma vec4(0.299, 0.587, 0.114, 1.)
#define R uResolution
#define COORD_Y 2.

vec4 blend(vec4 c1, vec4 c2) {
   return iFrame < 1 ? c1 : c1 * 0.02 + c2 * 0.98;
   }

void maine() {

  vec2 uv = gl_FragCoord.xy / R.xy;
  vec2 texel = 1. / R.xy;

  float step_y = texel.y;
  vec2 s = vec2(0.0, -step_y);
  vec2 n = vec2(0.0, step_y);

  vec4 im = texture(iChannel0, uv);
  vec4 im_s = texture(iChannel0, uv + s);
  vec4 im_n = texture(iChannel0, uv + n);

  // use luminance for sorting
  float len_n = dot(im_n, luma);
  float len = dot(im, luma);
  float len_s = dot(im_s, luma);

  if (int(mod(float(iFrame) + fragCoord.y, COORD_Y)) == 0) {

    if (len_s >= len) {
      im = im_s;
    }

  } else {

    if (len_n < len) {
      im = im_n;
    }
  }

  gl_FragColor = blend(texture(iChannel1, uv), im);
  // blending
  /**if(iFrame < 1) {
      fragColor = texture(iChannel1, uv);
  } else {
      fragColor = texture(iChannel1, uv) * 0.02 + im * 0.98;
  }*/
}