// Rebb/TRSi^Paradise 

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float glitter = 11.2;
    float an= sin(iTime)/3.14157;
    float h=0.7;

    float zoo = .23232+.38*sin(.7*iTime);
	  	
    vec2 p = -1.8*zoo+2.0*fragCoord.xy/iResolution.xy;  
 
     vec2 uv; 	
 
   

 
	uv.x =  p.x / p.y ;
	uv.y =  01.*iTime+h / abs(p.x);
	
 
fragColor = vec4(texture( iChannel0,uv).xyz*p.y*p.y, 1.0 );
}