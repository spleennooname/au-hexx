//#vertex

precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

varying vec2 vUV;

void main(void) {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUV = aUV;
}

//#fragment

precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec3 vNormal;
varying vec2 vUV;

void main( void ) {


 float v = 0.01;
  float r = 0.5;

  vec2 uv = vUV;
  vec4 sum = vec4( 0.0 );
  float vv = v * abs( r - vUV.y );

  
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y - 4.0 * vv ) ) * 0.051;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y - 3.0 * vv ) ) * 0.0918;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y - 2.0 * vv ) ) * 0.12245;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y - 1.0 * vv ) ) * 0.1531;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y ) ) * 0.1633;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y + 1.0 * vv ) ) * 0.1531;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y + 2.0 * vv ) ) * 0.12245;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y + 3.0 * vv ) ) * 0.0918;
  sum += texture2D( uTexture, vec2( vUV.x, vUV.y + 4.0 * vv ) ) * 0.051;

  gl_FragColor = sum;

}
