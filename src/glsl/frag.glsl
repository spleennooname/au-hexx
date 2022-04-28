precision highp float;
precision highp int;

uniform sampler2D uPatternTexture;
uniform sampler2D uTexture;

uniform vec2 uResolution;
uniform float uTime;

uniform float loudness;
uniform float perceptualSharpness;
uniform float perceptualSpread;
uniform float spectralFlatness;
uniform float spectralKurtosis; 

varying vec3 vCameraPos;
varying mat3 vRotation;

#define R uResolution
#define time uTime

#define PI 3.141

#define LOOK_AT vec3(0., 0., 0.)
#define UP vec3(0., 0., 10.)

#define COLOR_GLOW vec4(1.0, 0.4, 0.0, 1.0)
#define COLOR_BACKGROUND vec4(0.1804, 0.0078, 0.0078, 1.0)

#define MIN_DIST 1.
#define MAX_DIST 10.
#define MAX_STEPS 96

#define FOV 70.

struct Ray {
  vec3 org;
  vec3 dir;
};


vec4 tunnel2(sampler2D texture, vec2 R, float speed, float t) {
  
  vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy / R.xy);

  t *= 0.5;
  p += vec2(cos(t), sin(t)) * .25;

  float
     a = atan(p.y, p.x),
     r = length(p);

 vec2 newUv = vec2(
    1.0/r + t,
    a * 2./PI + t
  ); 

  float fog = smoothstep(0., 0.95, 1. -r);

  vec4 tex= 1. - texture2D(texture, newUv);

  return mix(tex * r * 1e-1, vec4(0.0), fog);
} 

/* vec4 tunnel(sampler2D texture, vec2 R, float speed, float t) {
  vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy / R.xy);
  vec2 newUv = vec2(p.x / p.y, 1.5 * t + speed / abs(p.x) );
  vec4 c = mix(texture2D(texture, newUv), vec4(p.y * p.y), 0.9);
  return c;
} */
 
vec4 background(vec3 dir) {
  return vec4(dir, 1.) * COLOR_BACKGROUND;
}

float sdHexPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  float x = mix(0.25, .5, 1.);
  float y = mix(0.25, .5, 1.);
  return max(q.z - h.y, max((q.x * x + q.y * y), q.y) - h.x);
}

float map(vec3 p) {

  float t = time * 1e-3;

  for (int i = 0; i < 3; i++) {
    p = abs(p * vRotation + vec3(0.0, 0., (-1.5)));
    p.x -= (sin(t * .95) + .5);
    p.y -= (cos(t * .95) + .25);
    p.z -= (sin(t * .95) + .25);
  }
  return sdHexPrism(
    p, 
    vec2(
       0.5 + mix(0., 0.5, loudness) * cos(t), 
      mix(0., 0.5, perceptualSharpness)  + .5 * sin(t)
    ) 
  );
}

// Tetrahedral normal, to save a couple of "glow" calls. Courtesy of IQ.
vec3 calcNormal( in vec3 p ){
  // Note the slightly increased sampling distance, to alleviate
  // artifacts due to hit point inaccuracies.
  vec2 e = vec2(.0015, -.0015); 
  return normalize(
      e.xyy * map(p + e.xyy) + 
      e.yyx * map(p + e.yyx) + 
      e.yxy * map(p + e.yxy) + 
      e.xxx * map(p + e.xxx));
}

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

  vec4 col = vec4(0.);  

  float d,
     minDist = MIN_DIST,
     dist = 1e-2;

  vec3 pos;

  for (int i = 0; i < 16; i++) {
    pos = ray.org + dist * ray.dir;
    d = map(pos);
    if ( abs(d )<1e-3 && d > MAX_DIST ) break;
    dist += d;
    minDist = min(minDist, d);
  }

  if(d < MIN_DIST ){
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = background(r);
    float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
    col = 1.5 * refl * rf;
  } else {
    float glow = mix(1e-2, 1.2e-2, loudness) / minDist;
    col = background(ray.dir) + glow * COLOR_GLOW;
  }
  return col;
}

vec4 renderScene(Ray ray) {

  vec4 col = vec4(0., 0., 0., 1.);  
  vec3 pos;

  float 
    t = 0.0,
    d = 0.0,
    minDist = MIN_DIST;

  for (int i = 0; i < MAX_STEPS; i++) {
    pos = ray.org + t * ray.dir;
    d = map(pos);
    if ( abs(d )<1e-2 && d > MAX_DIST ) break;
    t += d;
    minDist = min(minDist, d);
  }

  if (d < MIN_DIST) {
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = selfReflect( Ray(pos, r) );
    float rf = 1.0 - abs(dot(ray.dir, n)) * .4;
    rf *= rf; 
    //col = vec4(1.0, 0., 0., 1.);
    col = refl * rf;
  }
  else {
    float glow = mix(1e-2, 0.3, loudness) / minDist; 
    col = glow * COLOR_GLOW;
  }
  return col;
}

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;
  
  vec4 c1 = tunnel2(uPatternTexture, R, 0.65, time);

  Ray ray = castRay(vCameraPos, LOOK_AT, UP, uv, FOV, R.x / R.y );

  vec4 c2 = renderScene(ray);

  gl_FragColor = sqrt(clamp( c1  + c2, 0., 1.));
}