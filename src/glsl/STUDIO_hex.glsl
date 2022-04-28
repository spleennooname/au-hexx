

precision highp float;
precision highp int;

uniform sampler2D uPatternTexture;
uniform sampler2D uTexture;

uniform vec2 uResolution;
uniform float uTime;

varying vec3 vCameraPos;
varying mat3 vRotation;

// fx

#define R uResolution
#define time uTime
#define PI 3.141

#define LOOK_AT vec3(1., 0., 0.)
#define UP vec3(0., 0., 0.75)

#define FOV 70.

#define COLOR_GLOW vec4(1.0, 0.4, 0.0, 1.0)
#define COLOR_TUNNEL vec4(0.1804, 0.0078, 0.0078, 1.0)
#define COLOR_BACKGROUND vec4(0.1804, 0.0078, 0.0078, 1.0)

#define MIN_DIST 1e-2
#define MAX_DIST 10.
#define MAX_STEPS 96

#define HAS_GLOW 1

vec4 tunnel(sampler2D texture, vec2 uv, vec2 R, float t) {
  float speed = 0.65;
  vec2 p = -1.0 + 2.0 * uv;//;
  vec2 newUv = vec2(
    p.x / p.y, 
    2. * t + speed / abs(p.x) 
  );
  return COLOR_TUNNEL * mix(texture2D(texture, newUv), vec4(p.y * p.y), 0.75);
}

vec4 background(vec3 dir) {
  return vec4(dir, 1.) * COLOR_BACKGROUND;
}

float sdHexPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  float x = mix(0.25, .5, 0.);
  float y = mix(0.25, .5, 0.);
  return max(q.z - h.y, max((q.x * x + q.y * y), q.y) - h.x);
}

float map(vec3 p) {

  float t = time * 1e-3;

  for (int i = 0; i < 3; i++) {
    p = abs(p * vRotation + vec3(0.0, 0., -2.5));
    p.x -= (sin(t * .25) + .5);
    p.y -= (cos(t * .75) + .25);
    p.z -= (cos(t * .25) + .25);
  }

  return sdHexPrism(p, vec2(
    0.5 + .5 * cos(t), 
    0.5 + .5 * sin(t) 
  ));
}

vec3 calcNormal(vec3 pos) {
  vec3 eps = vec3(1e-2, 0.0, 0.0);
  vec3 nor = vec3(map(pos + eps.xyy) - map(pos - eps.xyy),
                  map(pos + eps.yxy) - map(pos - eps.yxy),
                  map(pos + eps.yyx) - map(pos - eps.yyx));
  return normalize(nor);
}

struct Ray {
  vec3 org;
  vec3 dir;
};

Ray castRay(vec3 center, vec3 lookAt, vec3 up, vec2 uv, float fov, float aspect) {

  Ray ray;

  ray.org = center;

  vec3 dir = normalize(lookAt - center);
  up = normalize(up - dir * dot(dir, up));

  vec3 right = cross(dir, up);
  uv = 2. * uv - vec2(1.);

  fov *= PI / 100.;
  float tn = tan(fov / 2.);

  ray.dir = normalize(dir + tn * right * uv.x + tn / aspect * up * uv.y);

  return ray;
}

vec4 selfReflect(Ray ray) {

  float dist = 1e-2;

  vec3 pos;
  float minDist = MIN_DIST;
  float curMap;

  for (int i = 0; i < MAX_STEPS; i++) {
    pos = ray.org + dist * ray.dir;
    curMap = map(pos);
    dist += curMap;
    if (i > 3) {
      minDist = min(minDist, curMap);
    }
  }

  float m = map(pos);

  if(m < MIN_DIST){
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = background(r);
    float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
    rf *= rf;
    return refl * rf * 1.75;
  }

  float glow = 1e-2 / minDist;

  return background(ray.dir) + glow * COLOR_GLOW;
}

/* float raymarch(Ray ray){
   
  float 
    mind = MIN_DIST,
    t = 0.,
    d = 0.;

  vec3 p;

  for (int i = 0; i < MAX_STEPS; i++) {
    p = ray.org + t * ray.dir; // curr position along the ray
    d = map(p); // distance point-ray to closest object in scene
    if ( abs(d) < 1e-3 && d > MAX_DIST )  break; // no hit
    t += d * 0.75;
    mind = min(mind, d);
  } 

  return mind;
}
 */

vec4 render(Ray ray) {

  float minDist = MIN_DIST;

  vec3 pos; 

  float t = 0.0; 
  float d = 0.0;  

  for (int i = 0; i < MAX_STEPS; i++) {
    pos = ray.org + t * ray.dir;
    d = map(pos);
    
    t += d;
    minDist = min(minDist, d);
    if ( abs(d )<1e-3 && d > MAX_DIST ) break;
  }

  if (d < MAX_DIST) {
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = selfReflect( Ray(pos, r) );
    float rf = 1. - abs(dot(ray.dir, n));
    return refl * rf + background(ray.dir);
  }

  float glow = mix(0., 0.5, perceptualSharpness) / minDist; 

  return background(ray.dir) + glow * COLOR_GLOW;
}


// main

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;

  vec4 c1 = tunnel(uPatternTexture, uv, R, time * .5);

  Ray ray = castRay(vCameraPos, LOOK_AT, UP, uv, FOV, R.x / R.y );

  vec4 c2 = render(ray);

  gl_FragColor = sqrt(clamp(c1 + c2, 0., 1.));
}
