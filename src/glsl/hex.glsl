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

#define LOOK_AT vec3(1., 0., 0.)
#define UP vec3(0., 0., 0.75)

#define COLOR_GLOW vec4(1.0, 0.4, 0.0, 1.0)
#define COLOR_TUNNEL vec4(0.1804, 0.0078, 0.0078, 1.0)
#define COLOR_BACKGROUND vec4(0.1804, 0.0078, 0.0078, 1.0)

#define MIN_DIST 1E-2
#define FAR 10.
#define MAX_STEPS 64

#define HAS_GLOW 1

/* vec4 tunnel(sampler2D texture, vec2 R, float speed, float t) {
  
  vec2 p = -1.0 + 2.0 * (gl_FragCoord.xy / R.xy);

  p += vec2(cos(t), sin(t)) * .2;

  float
     a = atan(p.y, p.x),
     r = length(p);

 vec2 newUv = vec2(
    0.5/r + t,
    a/PI
  ); 

  float fog = smoothstep(0., .85, 1. - r * .5);

  vec4 c = mix(
    texture2D(texture, newUv), 
    vec4(p.y * p.y), fog);

  return c * COLOR_BACKGROUND;
} */

vec4 tunnel(sampler2D texture, vec2 uv, vec2 R, float t) {
  float speed = 0.65;
  vec2 p = -1.0 + 2.0 * uv;//;
  vec2 newUv = vec2(
    p.x / p.y, 
    2. * t + speed / abs(p.x) 
  );
  return mix(texture2D(texture, newUv), vec4(p.y * p.y), 0.75);
}

vec4 background(vec3 dir) {
  return vec4(dir, 1.0)* COLOR_BACKGROUND;
}

float sdHexPrism(vec3 p, vec2 h) {
  vec3 q = abs(p);
  float x = mix(0.5, .85, 1.);
  float y = mix(0.5, .85, 1.);
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
  return sdHexPrism(
    p, 
    vec2(
      0.75 + sin(t), 
      0.25 + cos(t) 
    ) 
  );
}

/* vec3 calcNormal(vec3 pos) {
  vec3 eps = vec3(0.01, 0.0, 0.0);
  vec3 nor = vec3(map(pos + eps.xyy) - map(pos - eps.xyy),
                  map(pos + eps.yxy) - map(pos - eps.yxy),
                  map(pos + eps.yyx) - map(pos - eps.yyx));
  return normalize(nor);
} */

// Tetrahedral normal, to save a couple of "map" calls. Courtesy of IQ.
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


/* vec4 selfReflect(Ray ray) {

  vec3 pos;
   
  float
    t = 0.0,
    minDist = MIN_DIST,
    d = 0.0;

  for (int i = 0; i < MAX_STEPS; i++) {
    pos = ray.org + t * ray.dir;
    d = map(pos);
    t += d;
    if (i > 3) {
      minDist = min(minDist, d);
    }
  }

  float m = map(pos);

  if(m < MIN_DIST){
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = background(r);
    float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
    return refl * rf;
  }

  float glow = 1e-2 / minDist;

  return background(ray.dir) + glow * COLOR_GLOW;
} */

vec4 renderScene(Ray ray) {

  vec4 col = vec4(0.);  
  vec3 pos;

  float 
    t = 0.0,
    d = 0.0,
    minDist = MIN_DIST;

  for (int i = 0; i < MAX_STEPS; i++) {
    pos = ray.org + t * ray.dir;
    d = map(pos);
    if ( abs(d ) < 1e-3 && d > FAR ) break;
    minDist = min(minDist, d);
    t += d;
  }
   
   //col = vec4(vec3(t), 1.);

  if (d < FAR) {
    /*vec3 n = calcNormal( ray.org + t * ray.dir);
    vec3 r = reflect(ray.dir, n);
    float rf =  1. - abs(dot(ray.dir, n));
    vec4 refl = selfReflect( Ray(pos, r) );
    col = refl * rf;// + background(ray.dir);*/
    col = background(ray.dir);//vec4(d,d,d, 1.);
  } else {
    col = background(ray.dir);
    /*#if HAS_GLOW == 1
       float glow = 0.05 / minDist;
      col += glow * COLOR_GLOW;
    #endif   */
  }

 
  //col = clamp(col + glow * COLOR_GLOW, 0., 1.);
 
 /*  #if HAS_GLOW == 1
      float glow = 1e-3 / d; 
      col += glow * COLOR_GLOW;
    #endif  */

  return col;
}

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
    if ( abs(d )<1e-3 && d > FAR ) break;
  }

  vec4 col;

  if (d < FAR) {
    vec3 n = calcNormal(pos);
    vec3 r = reflect(ray.dir, n);
    vec4 refl = selfReflect( Ray(pos, r) );
    float rf = 1. - abs(dot(ray.dir, n));
    col = refl * rf;
  } else {
    float glow = 1e-3 / minDist; 
    col = background(ray.dir) + glow * COLOR_GLOW;
  }
  return col;
}

void main() {

  vec2 uv = gl_FragCoord.xy / R.xy;
  
 vec4 c1 = tunnel(uPatternTexture, uv, R, time * .5);

  Ray ray = castRay(vCameraPos, LOOK_AT, UP, uv, 80., R.x / R.y );

  vec4 c2 = render(ray);

  gl_FragColor = sqrt(clamp( c2 + c1, 0., 1.));
}