

precision highp float;
precision lowp int;

uniform sampler2D uPatternTexture;
uniform sampler2D uTexture;

uniform vec2 uResolution;
uniform float uTime;

varying vec3 cameraPos;
varying mat3 rotation;

// fx

#define R uResolution
#define time uTime
#define PI 3.141
#define COLOR_GLOW vec3(1.0, 0.4, 0.0)
#define COLOR_DOOM vec3(1.0, 0.3, 0.0)
#define LOOK_AT vec3(1., 0., 0.)
#define UP vec3(0., 0., 0.75)
#define BACKGROUND vec3(1.0, 0.25, 0.0)
#define MIN_DIST 10.
#define NUM_ITERATIONS 15

// structures

struct Ray {
  vec3 org;
  vec3 dir;
};


/* float hash(float f) {
  return fract(sin(f * 32.34182) * 43758.5400);
}

float hash(vec2 p) {
  return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
} */

vec3 tunnel(sampler2D texture, vec2 R, float t) {
  float h = 0.25;
  vec3 col = vec3(0.0);
  vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy / R.xy);
  vec2 tx_uv = vec2(p.x / p.y, 1.5 * t + h / abs(p.x) );
  col = texture2D(texture, tx_uv).xyz * p.y * p.y;
  return col;
}

vec3 bg(vec3 dir) {
  vec3 c = vec3(0.);
  return c;
}

vec3 background(vec3 dir) {
  return BACKGROUND * bg(dir);
}

float sdHexPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  return max(q.z - h.y, max((q.x * 0.866025 + q.y * 0.5), q.y) - h.x);
}

float map(vec3 p) {
  float t = time * 0.002;

  for (int i = 0; i < 3; i++) {
    p = abs(p * rotation + vec3(0.0, 0., -2.5));
    p.x -= (sin(t * .25) + .5);
    p.y -= (cos(t * .75) + .35);
    p.z -= (cos(t * .25) + .15);
  }
  return sdHexPrism(p, vec2(0.75, 0.5 + sin(t)) );
}

vec3 normal(vec3 pos) {
  vec3 eps = vec3(0.05, 0.0, 0.0);
  vec3 nor = vec3(map(pos + eps.xyy) - map(pos - eps.xyy),
                  map(pos + eps.yxy) - map(pos - eps.yxy),
                  map(pos + eps.yyx) - map(pos - eps.yyx));
  return normalize(nor);
}

Ray createRay(vec3 center, vec3 lookAt, vec3 up, vec2 uv, float fov, float aspect) {

  Ray ray;

  ray.org = center;

  vec3 dir = normalize(lookAt - center);
  up = normalize(up - dir * dot(dir, up));

  vec3 right = cross(dir, up);
  uv = 2. * uv - vec2(1.);

  fov = fov * PI / 100.;
  float tn = tan(fov / 2.);

  ray.dir = normalize(dir + tn * right * uv.x + tn / aspect * up * uv.y);

  return ray;
}

vec3 selfReflect(Ray ray) {

  float dist = 0.01;

  vec3 pos;
  float minDist = MIN_DIST;
  float curMap;

  for (int i = 0; i < NUM_ITERATIONS; i++) {
    pos = ray.org + dist * ray.dir;
    curMap = map(pos);
    dist += curMap;
    if (i > 3) {
      minDist = min(minDist, curMap);
    }
  }

  float m = map(pos);

  if (m < 0.01) {
    vec3 n = normal(pos);
    vec3 r = reflect(ray.dir, n);
    vec3 refl = background(r);
    float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
    rf *= rf;
    return refl * rf * 1.5;
  }

  float glow = 0.1 / minDist;

  return background(ray.dir) + glow * COLOR_GLOW;
}

vec3 render(Ray ray) {

  float dist = 0.01;

  vec3 pos;
  float minDist = MIN_DIST;
  float curMap;

  for (int i = 0; i < NUM_ITERATIONS; i++) {
    pos = ray.org + dist * ray.dir;
    curMap = map(pos);
    dist += curMap;
    minDist = min(minDist, curMap);
  }

  float m = map(pos);

  if (m < 0.01) {
    vec3 n = normal(pos);
    vec3 r = reflect(ray.dir, n);
    vec3 refl = selfReflect(Ray(pos, r));
    float rf = .8 - abs(dot(ray.dir, n)) * .4;
    rf *= rf;
    return refl * rf * 1.75;
  }

  float glow = 0.1 / minDist;

  return background(ray.dir) + glow * COLOR_GLOW;
}
// main

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;

  vec3 col = BACKGROUND;

  vec3 doom = COLOR_DOOM * tunnel(uPatternTexture, R, time * .5);

  Ray ray = createRay(cameraPos, LOOK_AT, UP, uv, 70., R.x / R.y );

  col = render(ray);

  gl_FragColor = mix( vec4( col +  doom, .75), texture2D(uTexture, uv), 0.5);
}
