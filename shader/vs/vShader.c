attribute vec3 vPos;
attribute vec4 vCol;
uniform mat4 pMat;
uniform mat4 mMat;
uniform mat4 vMat;
varying vec4 vColor;

void main(void) {
    gl_Position = pMat*vMat*mMat*vec4(vPos, 1.0);
    vColor = vCol;
}
