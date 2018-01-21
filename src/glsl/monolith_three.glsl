
#ifdef GL_ES
precision mediump float;
#endif
               
uniform float uTime;
uniform vec2 iResolution;

varying vec2 vUv;

// fx 

#define PI 3.141592653589
#define tick() ( uTime * 0.001 )

struct Ray {
	vec3 org;
	vec3 dir;
};

mat3 rotateX(float a){
    return mat3(1.,0.,0.,
                0.,cos(a), -sin(a),
                0.,sin(a), cos(a));
}

mat3 rotateY(float a){
    return mat3(cos(a), 0., -sin(a),
                0.,1.,0.,
                sin(a), 0., cos(a));
}

mat3 rotation;

float hash(float f)
{
    return fract(sin(f*32.34182) * 43758.5453);
}

float hash(vec2 p)
{
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 grid(vec3 dir, bool vert){
    
    vec2 p = dir.xy / max(0.001, abs(dir.z));
    
    p *= 3.;
    
    float time = uTime * 0.01;

    p.y *= 0.06;
    p.y += time * 20.3;
    vert = hash(floor(p.y/5. + 0.5)) < 0.5 ? vert : !vert;
    p += 0.5;
    
    float h = hash(floor(p*sign(dir.z)));
    float h2 = hash(floor(p.y/6.));
    float h3 = hash(floor(p.y/20.)+sign(dir.z));
    float band = abs(p.x) < 2. + floor(30.*h3*h3) ? 1. : 0.;
    
    p = mod(p, vec2(1.));
    p -= 0.5;
    float f = h2 < 0.5 ? smoothstep(0.6, 0.0,length(p))*6. : 2.;
    
    h = h < h2/1.2 + 0.1 && vert ? 1. : 0.;
    
    vec3 acc = hsv2rgb(vec3(h2/5.+ time/30.,.9,0.9))*h*band*3.*f;
    
    return acc*pow(abs(dir.z),.5);
}

vec3 background(vec3 dir){
  return 0.2 * grid(dir.zxy, true) + 0.2 * grid(dir.yxz, false);
}

// float box(vec3 p, vec3 w){
//    p = abs(p);
//    return max( p.y-w.x, max ( p.y-w.z, p.z-w.z*p.x ) );
// }

float box(vec3 p, vec3 w){
    p = abs(p);
    return max(p.x-w.x, max(p.y-w.y, min(p.z-w.z, p.x) ) );
}

float map(vec3 p){
    for (int i = 0; i < 3; i++){
        float time = uTime;
        p = abs(p*rotation + vec3(0.1, .0, .0));
        p.x -= (sin(time/8.) + 1.)/2.;
        p.y -= (sin(time/7.) + 1.)/3.;
        p.z -= (sin(time/3.) + 1.)/4.;
    }
    return box(p, vec3(0.8, 4.4, 0.4));
}

vec3 normal(vec3 pos)
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(map(pos+eps.xyy) - map(pos-eps.xyy),
                    map(pos+eps.yxy) - map(pos-eps.yxy),
                    map(pos+eps.yyx) - map(pos-eps.yyx) );
	return normalize(nor);
}

vec3 selfReflect(Ray ray){
    float dist = 0.01;
    vec3 pos;
    float minDist = 1000.;
    float curMap;
    for (int i = 0; i < 20; i++){
        pos = ray.org + dist*ray.dir;
        curMap = map(pos);
        dist+=curMap;
        if(i > 7){
            minDist = min(minDist,curMap);
        }
    }
    float m = map(pos);
    if (m < 0.01){
        vec3 n = normal(pos);
        vec3 r = reflect(ray.dir, n);
        vec3 refl = background(r);
        float rf = 0.8-abs(dot(ray.dir, n))*.4;
        rf *= rf;
        return refl*rf*1.3; 
    }
    float glow = 0.02/minDist;

    return background(ray.dir)*0.5 + glow * vec3(1.0, .0, 0.);
}

vec3 render(Ray ray){

    float dist = 0.;
    
    vec3 pos;
    float minDist = 1000.;
    float curMap;

    for (int i = 0; i < 20; i++){
        pos = ray.org + dist*ray.dir;
        curMap = map(pos);
        dist+=curMap;
        minDist = min(minDist,curMap);
    }
    
    float m = map(pos);
    
    if (m < 0.01){
        vec3 n = normal(pos);
        vec3 r = reflect(ray.dir, n);
        vec3 refl = selfReflect(Ray(pos, r));
        float rf = 0.8-abs(dot(ray.dir, n))*.4;
        rf *= rf;
        return refl*rf*1.5; 
    }

    float glow = 0.04/minDist;

    return background(ray.dir)*0.5 + glow * 1.0; //* vec3(1.9, 2.4, 3.2);
}

Ray createRay(vec3 center, vec3 lookAt, vec3 up, vec2 uv, float fov, float aspect){
	Ray ray;
	ray.org = center;

	vec3 dir = normalize(lookAt - center);
	up = normalize(up - dir*dot(dir,up));
	
  vec3 right = cross(dir, up);
	uv = 2.*uv - vec2(1.);
	
  fov = fov * PI / 180.;
	ray.dir = dir + tan(fov/2.) * right * uv.x + tan(fov/2.) / aspect * up * uv.y;
	ray.dir = normalize(ray.dir);	
	
  return ray;
}

// main
           
void main( void) {
  
    vec2 uv = vUv;
    float time = uTime * 0.01;
    vec2 size = iResolution;

    vec2 p = gl_FragCoord.xy / size;
  
    vec3 cameraPos = vec3( -8., 2.*sin(time/10.), -4.*sin(time/4.) );

    vec3 lookAt = vec3( 0. );

    vec3 up = vec3(0., 0., 0.5);

    float aspect = size.x/size.y;

    float xt = floor(time/8.) + clamp(fract(time/4.)*20.,0.,1.);
    float yt = floor(time/2.) + clamp(fract(time/2.)*5.,0.,1.);
    
    rotation = rotateX(xt*PI/4.)*rotateY(yt*PI/2.);
	
    Ray ray = createRay(cameraPos, lookAt, up, uv, 90., aspect);

    vec3 col = render(ray);
    
    col = clamp(col, 0., 1.);
 
    gl_FragColor = vec4(col, 0.25);
}