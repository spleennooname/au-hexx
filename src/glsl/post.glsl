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

  vec2 uv = vUV;

  vec3 col = texture2D( uTexture, uv).rgb;

  gl_FragColor = vec4(col, 1.0);

}
