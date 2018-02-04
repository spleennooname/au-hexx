 precision mediump float;

    uniform vec2 iResolution;
    uniform float uTime;

    #define PI 3.141592653589
    #define COLOR_GLOW vec3(1.0, 0.4, 0.4)
    #define LOOK_AT vec3(0., 0., 0.)
    #define UP vec3(0.,0., .5)
    #define BACKGROUND 0.75

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

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 grid(vec3 dir, bool vert){
        
        vec2 p = dir.xy / max(0.001, abs(dir.z) );
        
        p *= 2.;
        
        float time = uTime;

        p.y *= 0.1;
        p.y += time * 0.3;

        vert = hash(floor(p.y/5. + 0.5)) < 0.5 ? vert : !vert;
        p += 0.5;
        
        float h = hash(floor(p*sign(dir.z)));

        float h2 = hash( floor(p.y/1.) );
        float h3 = hash( floor(p.y/1.) + sign(dir.z)) ;

        float band = abs(p.x) < 2. + floor(10.*h3*h3) ? 1. : 0.;
        
        p = mod(p, vec2(1.));
        p -= 0.5;

        float f = h2 < 0.5 ? smoothstep(0.6, 0.0,length(p))*6. : 2.;
        
        h = h < h2/1.2 + 0.1 && vert ? 1. : 0.;
        
        vec3 acc =  vec3( 1., h2/10. + time/20.,  1.)  * h * band * 1. * f;
        //vec3 acc = vec3( time/10., time/20., 1.) * h * band *3. * f; 
        
        return acc * pow( abs(dir.z), .25);

    }

    vec3 background(vec3 dir){
      return BACKGROUND * ( grid(dir.yxz, true) + grid( dir.yxz, true) );
      //return vec3(0.);
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

    float sdHexPrism( vec3 p, vec2 h )
    {
        vec3 q = abs(p);
        return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
    }

    float udBox( vec3 p, vec3 b )
    {
        p = abs(p);
      return length( max( p.x - b.x*0.5, 1.5 * p.y - b.y) );
    }

    float sdTriPrism( vec3 p, vec2 h )
    {
        vec3 q = abs(p);
        return max( q.z-h.y, max(q.x*0.866025 + p.y*0.866025, -p.y) - h.y*0.5 );
    }

    float box(vec3 p, vec3 w){
        p = abs(p);
        //return max(p.x-w.x, max(p.y-w.y, p.z-w.z ) );
        //return max(p.x-w.x, max(p.y-w.y, min(p.x-w.x, p.y) ) );
        return length(max(abs(p)-w,0.0));

    }

    float map(vec3 p){
        float time = uTime * 0.05;
        for (int i = 0; i < 3; i++){
            p = abs( p*rotation + vec3(0.75, .3, .0));
            p.x -= (sin(time/5.) + 1.)/3.;
            p.y -= (sin(time/5.) + 1.)/3.;
            p.z -= (sin(time/5.) + 1.)/3.;
        }
        //original: vec3(0.8, 4.4, 0.4)
      // return box(p, vec3(0.95, 5., 1.75));
        //return udBox(p, vec3(0.95, 5., 1.75) );
      return sdTriPrism(p, vec2(1.25, 2.5) );
    }

    vec3 normal(vec3 pos)
    {
      vec3 eps = vec3( 0.002, 0.0, 0.0 );
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
        for (int i = 0; i < 30; i++){
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
            float rf = 0.8 - abs(dot(ray.dir, n)) * .4;
            rf *= rf;
            return refl*rf*1.3; 
        }
        float glow = 0.04/minDist;

        return background(ray.dir)*0.5 + glow * COLOR_GLOW;
        //return glow * COLOR_GLOW;
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

    vec3 render(Ray ray){

        float dist = 0.;
        
        vec3 pos;
        float minDist = 1000.;
        float curMap;

        for (int i = 0; i < 30; i++){
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
            return refl*rf*1.5; 
        }

        float glow = 0.03/minDist;

        return background(ray.dir)*0.5 + glow * COLOR_GLOW;
    }

    void main( void ) {
        
        vec2 uv = gl_FragCoord.xy / iResolution;
        vec2 p = uv;

        float time = uTime;

        vec3 cameraPos = vec3(-8.,2.*sin(time/10.),-4.*sin(time/4.));
        //float aspect = size.x/size.y;

        float xt = floor(time/8.) + clamp(fract(time/2.)*20.,0.,1.);
        float yt = floor(time/2.) + clamp(fract(time/2.)*5.,0.,1.);
        
        rotation = rotateX(xt*PI/4.)*rotateY(yt*PI/2.);
      
        Ray ray = createRay(cameraPos, LOOK_AT, UP, p, 110., (iResolution.x/ iResolution.y) );

        vec3 col = render(ray);

        //col = pow(col, vec3(1.5));
    
        vec2 coord = (uv - 0.5) * (iResolution.x/iResolution.y) * 2.0;
        float rf = sqrt(dot(coord, coord)) * .85;
        float rf2_1 = rf * rf + 1.0;
        float vg = 1.0 / (rf2_1 * rf2_1);
      
        gl_FragColor = vec4(col * vg, 1.0);
        

    }