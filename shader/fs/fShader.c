precision mediump float;
varying vec2 uvCoords;
uniform int texCount;
uniform sampler2D texSampler0;
void main(void) {
    vec4 endColor = texture2D(texSampler0,uvCoords);
    gl_FragColor = endColor;
}
