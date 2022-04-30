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

#define COLOR_GLOW vec4(0.9686, 0.6196, 0.0196, 1.0)
#define COLOR_BACKGROUND vec4(0.8627, 0.3804, 0.0588, 1.0)

#define MIN_DIST 5.
#define MAX_DIST 6.
#define MAX_STEPS 32

#define FOV 70.

vec4 tunnel(sampler2D texture, vec2 R, float t) {
  
  vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy / R.xy);

  t *= 0.2;

  p += vec2(cos(t), sin(t)) * .25;

  float
     a = atan(p.y, p.x),
     r = length(p);

 vec2 newUv = vec2(
    1.0/r + t,
    a * 2./PI + t
  ); 

  return (1. - texture2D(texture, newUv)) * 0.025 * r * r;
} 
 
float sdHexPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  float x = 0.5;
  float y = 0.5;
  return max(q.z - h.y, max((q.x * x + q.y * y), q.y) - h.x);
}

float map(vec3 p) {

  float t = time * 1e-3;

  vec3 rt = vec3(
      sin(t * .95) + .5,
      cos(t * .95) + .25,
      sin(t * .95) + .25
  );

  p = abs(p * vRotation + vec3(0.0, 0., -1.5));
  p -= rt; 

  p = abs(p * vRotation + vec3(0.0, 0., -3.5));
  p -= rt; 

  p = abs(p * vRotation + vec3(0.0, 0., -0.5));
  p -= rt; 
  
  return sdHexPrism(
    p, 
    vec2(
      0.5 + 0.5 * cos(t), 
      0.5 + 0.5 * sin(t)
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

  uv = 2. * uv - 1.;

  fov *= PI / 100.;
  float tn = tan(fov / 2.);

  ray.dir = normalize(dir + tn * right * uv.x + tn / aspect * up * uv.y);

  return ray;
}

vec4 selfReflect(vec3 ro, vec3 rd) {

  vec4 col = vec4(0.);  

  float d,
     minDist = MIN_DIST,
     dist = 1e-2;

  vec3 p;

  for (int i = 0; i < 16; i++) {
    p = ro + dist * rd;
    d = map(p);
    if ( abs(d )<1e-1 && d > MAX_DIST ) break;
    dist += d;
    minDist = min(minDist, d);
  }
  
  if(d < MIN_DIST ){
    vec3 
      n = calcNormal(p),
      r = reflect(rd, n);
    vec4 refl = vec4(r, 1.) * COLOR_BACKGROUND;
    float rf = 1. - abs(dot(rd, n)) * 1.;
    col = rf * refl * rf;
  } else {
    col = vec4(rd, 1.) * COLOR_BACKGROUND + (1e-2 / minDist) * COLOR_GLOW;
  }
  return clamp(col, 0., 1.);
}

vec4 renderScene(vec3 ro, vec3 rd) {

  vec4 col = vec4(0);  
  vec3 p;

  float 
    t = 0.0,
    d = 0.0,
    minDist = MIN_DIST;

  for (int i = 0; i < MAX_STEPS; i++) {
    p = ro + t * rd;
    d = map(p);
    if ( abs(d )<1e-1 && d > MAX_DIST ) break;
    t += d;
    minDist = min(minDist, d);
  }

  if (d < MIN_DIST) {
    vec3 n = calcNormal(p);
    vec3 r = reflect(rd, n);
    vec4 refl = selfReflect(p, r);
    float rf = 1.0 - abs(dot(rd, n));
    col = refl * rf *rf;
  }
  else 
  {
    col = (0.05 / minDist) * COLOR_GLOW;
  }
  return max(col, 0.);
}

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;
  
  Ray ray = castRay(vCameraPos, LOOK_AT, UP, uv, FOV, R.x / R.y );

  vec4 ct = tunnel(uPatternTexture, R, time);
 
  vec4 cr = renderScene(ray.org, ray.dir);

  gl_FragColor = sqrt(max(ct + cr, 0.));
}