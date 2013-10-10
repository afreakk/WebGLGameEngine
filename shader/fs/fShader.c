precision mediump float;
varying vec2 uvCoords;
uniform sampler2D texSampler;
void main(void) {
    gl_FragColor = texture2D(texSampler,uvCoords);
}
