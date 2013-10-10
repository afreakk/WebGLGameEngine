attribute vec3 vPos;
attribute vec2 uvMap;
uniform mat4 pMat;
uniform mat4 mMat;
uniform mat4 vMat;
varying vec2 uvCoords;
void main(void) {
    gl_Position = pMat*vMat*mMat*vec4(vPos, 1.0);
    uvCoords = uvMap;
}
