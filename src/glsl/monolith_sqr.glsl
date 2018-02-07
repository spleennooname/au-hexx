//#vertex

precision highp float;

attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment

precision highp float;
precision lowp int;
               
uniform float uTime;
uniform vec2 iResolution;
uniform mediump sampler2D uPatternTexture;

varying vec2 vUV;

// fx 

#define PI 3.141592653589
#define COLOR_GLOW vec3(1.0, 0.4, 0.0)
#define COLOR_DOOM vec3(1.0, 0.3, 0.0)
#define LOOK_AT vec3(1., 0., 0.)
#define UP vec3(0.,0., 0.2)
#define BACKGROUND vec3(0.25)
#define MIN_DIST 1000.
#define NUM_ITERATIONS 28

struct Ray {
	vec3 org;
	vec3 dir;
};

mat3 rotation;

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

float hash(float f)
{
    return fract(sin(f*32.34182) * 43758.5400);
}

float hash(vec2 p)
{
    return fract(sin(dot(p.xy , vec2(12.9898,78.233))) * 43758.5453);
}

float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

// vec3 hsv2rgb(vec3 c)
// {
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

// vec3 grid(vec3 dir, bool vert){

//     float time = uTime * 0.0005;

//     vec2 p = dir.xy / max(0.001, abs(dir.z));
    
//     p *= 3.;
//     p.y *= 0.06;
//     p.y += time * 20.3;
    
//     vert = hash(floor(p.y/5. + 0.5)) < 0.5 ? vert : !vert;

//     p += 0.5;
    
//     float h = hash(floor(p*sign(dir.z)));
    
//     float h2 = hash(floor(p.y/10.));
    
//     float h3 = hash(floor(p.y/20.)+sign(dir.z));

//     float band = abs(p.x) < 2. + floor(60.*h3*h3) ? 1. : 0.;
    
//     p = mod(p, vec2(1.));
    
//     p -= 0.5;
    
//     float f = h2 < 0.5 ? smoothstep(100.8, 0.0,  length(p) )*6. : 2.;
    
//     h = h < h2/5. + 0.1 && vert ? 1. : 0.;
    
//     //vec3 acc = hsv2rgb( vec3(h2/5.+time/30.,.9,0.9)) *h  *band * 3.* f;
//     vec3 acc = vec3( 1.0, 0.0, 0.) * h  * band * 3.* f;

//     return acc;//*pow(abs(dir.z),.5);
// }


vec3 tunnel( sampler2D texture, vec2 iResolution, float time ){

    float h=0.5;
    vec3 col = vec3(0.0);

    float zoo = 0.5 + 0.25 * sin( .5*time );

    vec2 p = -1.8 * zoo + 2.0 * (gl_FragCoord.xy/iResolution.xy);  

    vec2 tx_uv;
    tx_uv.x =  p.x / p.y ;
    tx_uv.y = 01.* time + h / abs(p.x);

    col = texture2D( texture, tx_uv ).xyz * p.y * p.y;
    return col;
}

vec3 background(vec3 dir){
  return BACKGROUND;//* ( grid( dir.yxz, false)  );
  //return BACKGROUND * ( tunnel( uPatternTexture, iResolution, uTime )  );
}

//original
// float box(vec3 p, vec3 w){
//     p = abs(p);
//     return max(p.x-w.x, max(p.y-w.y, p.z-w.z));
// }

// float box(vec3 p, vec3 w){
//     p = abs(p);
//     float box = max( p.x - w.x, max( 1.0*p.y - w.y, min(p.z - w.z, w.x ) ) );
//     return box;
// }

float sdHexPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

// float udBox( vec3 p, vec3 b )
// {
//     p = abs(p);
//   return length( max( p.x - b.x*0.5, 1.5 * p.y - b.y) );
// }

// float sdTriPrism( vec3 p, vec2 h )
// {
//     vec3 q = abs(p);
//     return max( q.z-h.y, max(q.x*0.866025 + p.y*0.866025, -p.y) - h.y*0.7 );
// }

// float box(vec3 p, vec3 w){
//     p = abs(p);
//      //return max(p.x-w.x, max(p.y-w.y, p.z-w.z ) );
//     //return max(p.x-w.x, max(p.y-w.y, min(p.x-w.x, p.y) ) );
//     return length(max(abs(p)-w,0.0));

// }

// float map(vec3 p){
//     float time = uTime * 0.002;
//     for (int i = 0; i < 3; i++){
//         p = abs( p*rotation + vec3(0.75, .3, .0));
//         p.x -= (sin(time/5.) + 1.)/3.;
//         p.y -= (sin(time/5.) + 1.)/3.;
//         p.z -= (sin(time/10.) + 1.)/20.;
//     }
//     //original: vec3(0.8, 4.4, 0.4)
//    // return box(p, vec3(0.95, 5., 1.75));
//     //return udBox(p, vec3(0.95, 5., 1.75) );
//   return sdTriPrism(p, vec2(10.5, 1.5) );
// }

// float box(vec3 p, vec3 w){
//     p = abs(p);
//     float dx = p.x-w.x;
//     float dy = p.y-w.y;
//     float dz = p.z-w.z;
//     float m = max(dx, max(dy, dz) );
//     return m; 
// }

float map(vec3 p){
    float time = uTime * 0.002;
    for ( int i = 0; i < 3; i++){
       p = abs( p*rotation + vec3(0.1, .0, .0));
       p.x -= (sin(time * 1. ) + 0.5) * .25;
       p.y -= (sin(time * .25 ) + 0.15) * .25;
       //p.z -= (sin(time/3.) + 1.)/4.;
    }
    return sdHexPrism(p, vec2(0.75 * 1., 0.75 * 5.) );
    //return sdTriPrism(p, vec2(1.8, 2.0) );
    //return box(p, vec3(2.8, 100.4, 0.4));
}

vec3 normal(vec3 pos)
{
	vec3 eps = vec3( 0.002, 0.0, 0.0 );
	vec3 nor = vec3(map(pos+eps.xyy) - map(pos-eps.xyy),
                    map(pos+eps.yxy) - map(pos-eps.yxy),
                    map(pos+eps.yyx) - map(pos-eps.yyx) );
	return normalize(nor);
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

vec3 selfReflect(Ray ray){
    
    float dist = 0.01;

    vec3 pos;
    float minDist = MIN_DIST;
    float curMap;
    
    for (int i = 0; i < NUM_ITERATIONS; i++){
        pos = ray.org + dist*ray.dir;
        curMap = map(pos);
        dist+=curMap;
        if(i > 3){
            minDist = min(minDist,curMap);
        }
    }
    
    float m = map(pos);

    if (m < 0.01){
        vec3 n = normal(pos);
        vec3 r = reflect(ray.dir, n);
        vec3 refl = background(r);
        float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
        rf *= rf;
        return refl*rf*1.3; 
    }
    
    float glow = 0.02/minDist;

    return background(ray.dir)*0.25 + glow * COLOR_GLOW;
    //return glow * COLOR_GLOW;
}


vec3 render(Ray ray){

    float dist = 0.;
    
    vec3 pos;
    float minDist = MIN_DIST;
    float curMap;

    for (int i = 0; i < NUM_ITERATIONS; i++){
        pos = ray.org + dist*ray.dir;
        curMap = map(pos);
        dist += curMap;
        minDist = min(minDist,curMap);
    }
    
    float m = map(pos);
    
    if (m < 0.001){
        
        vec3 n = normal(pos);
        vec3 r = reflect(ray.dir, n);
        vec3 refl = selfReflect(Ray(pos, r));
        float rf = 1.0-abs(dot(ray.dir, n) )*.4;

        rf *= rf;
        return refl*rf*0.75; 
    }

    float glow = 0.02/minDist;

    return background( ray.dir )*0.25 + glow * COLOR_GLOW;
}
// main
           
void main( void ) {
  
    vec2 uv = vUV;
    vec3 col = BACKGROUND;

    float time = uTime * 0.0007;
    float aspect = (iResolution.x/ iResolution.y);
   
    vec3 cameraPos = vec3 (-8., 2.*sin(time/8.), -2.*sin(time * .25) );
    float xt = floor(time * .125) + clamp(fract(time * 0.5)*20.,0.,1.);
    float yt = floor(time * .5) + clamp(fract(time * .5)*5.,0.,1.);
    
    rotation = rotateX( xt*PI/4. ) * rotateY( yt*PI/2.);
	
    Ray ray = createRay(cameraPos, LOOK_AT, UP, uv, 90., aspect );

    col = render(ray);

    vec3 doom = tunnel( uPatternTexture, iResolution, uTime* 0.0005);

    // vec2 center = vec2( 0.5 );
    // float noiseScale = 1.;
    // float radius = 0.5;
    // float scale =1.;
    // vec2 d = uv - center;
    // float r = length( d * vec2( 1., (iResolution.y/ iResolution.x) ) ) * scale;
    // float a = atan(d.y,d.x) + noiseScale*(radius-r)/radius;
    // vec2 uvt = center+r*vec2(cos(a),sin(a));
    // vec2 uv2 = vUV;
    // float c = ( .75 + .25 * sin( uvt.x * 1000. ) );
   

    col = (col + COLOR_DOOM * doom *.40 );

    // float l = luma( col);
    // float f = smoothstep( .5 * c, c, l );
    // f = smoothstep( 0., .5, f );
    // col = vec3(f);

    //vignetting 

    // vec2 coord = (uv - 0.5) * aspect * 2.0;
    // float rf = sqrt( dot(coord, coord) ) * .5;
    // float rf2_1 = rf * rf + 1.0;
    // float vg = 1.0 / (rf2_1 * rf2_1);
  
    gl_FragColor = vec4( col, 0.75);

}