attribute vec3 vPos;
attribute vec2 uvMap;
attribute vec3 normals;
attribute float materialIndex;
attribute vec3 diffColor;
attribute vec3 ambColor;
attribute vec3 specColor;
uniform mat4 pMat;
uniform mat4 mMat;
uniform mat4 vMat;
uniform vec3 lightPosition;
varying vec2 uvCoords;
varying vec3 Normal_cameraspace;
varying vec3 LightDirection_cameraspace;
varying vec3 EyeDirection_cameraspace;
varying float lightVertDistance;
varying float matIndexF;
varying vec3 diffuseColor;
varying vec3 ambientColor;
varying vec3 specularColor;
void main(void) {
    gl_Position = pMat*vMat*mMat*vec4(vPos, 1.0);
    // Position of the vertex, in worldspace : M * position
    vec3 Position_worldspace = (mMat * vec4(vPos,1.0)).xyz;
    lightVertDistance = distance(Position_worldspace,lightPosition);
    // Vector that goes from the vertex to the camera, in camera space.
    // In camera space, the camera is at the origin (0.0,0.0,0.0).
    vec3 vertexPosition_cameraspace = ( vMat * mMat * vec4(vPos,1.0)).xyz;
    EyeDirection_cameraspace = vec3(0.0,0.0,0.0) - vertexPosition_cameraspace;

    // Vector that goes from the vertex to the light, in camera space. M is ommited because it's identity.
    vec3 LightPosition_cameraspace = ( vMat * vec4(lightPosition,1.0)).xyz;
    LightDirection_cameraspace = LightPosition_cameraspace + EyeDirection_cameraspace;

    // Normal of the the vertex, in camera space
    Normal_cameraspace = ( vMat * mMat * vec4(normals,0.0)).xyz; 
    // Only correct if ModelMatrix does not scale the model ! Use its inverse transpose if not.
    uvCoords = uvMap;
    matIndexF = materialIndex;
    diffuseColor = diffColor;
    ambientColor= ambColor;
    specularColor = specColor;
}
