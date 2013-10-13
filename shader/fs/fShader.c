precision mediump float;
varying vec2 uvCoords;
varying vec3 Normal_cameraspace;
varying vec3 LightDirection_cameraspace;
uniform vec3 LightColor;
uniform float LightPower;
uniform sampler2D texSampler0;
uniform sampler2D texSampler1;
uniform sampler2D texSampler2;
uniform sampler2D texSampler3;
uniform int samplerCount[4];
varying float lightVertDistance;
varying vec3 EyeDirection_cameraspace;
varying float matIndexF;
varying vec3 diffuseColor;
varying vec3 ambientColor;
varying vec3 specularColor;
void main(void) {
    highp int matIndex = int(matIndexF);
    // Normal of the computed fragment, in camera space
    vec3 n = normalize( Normal_cameraspace );
    // Direction of the light (from the fragment to the light)
    vec3 l = normalize( LightDirection_cameraspace );
    float cosTheta = clamp( dot( n,l ), 0.0, 1.0 );
    // Eye vector (towards the camera)
    vec3 E = normalize(EyeDirection_cameraspace);
    // Direction in which the triangle reflects the light
    vec3 R = reflect(-l,n);
    // Cosine of the angle between the Eye vector and the Reflect vector,
    // clamped to 0
    //  - Looking into the reflection -> 1
    //  - Looking elsewhere -> < 1
    float cosAlpha = clamp( dot( E,R ), 0.0,1.0 );
    float specLight = pow(cosAlpha, 5.0);
    float distance = lightVertDistance*lightVertDistance;
    vec4 texture = vec4(1.0, 1.0, 1.0, 1.0);
    if(matIndex == samplerCount[0])
        texture = texture2D(texSampler0,uvCoords);
    else if(matIndex == samplerCount[1])
        texture = texture2D(texSampler1,uvCoords);
    else if(matIndex == samplerCount[2])
        texture = texture2D(texSampler2,uvCoords);
    else if(matIndex == samplerCount[3])
        texture = texture2D(texSampler3,uvCoords);
    vec3 color = ambientColor+(diffuseColor*texture.rgb)*LightColor*LightPower*cosTheta/distance+specularColor*LightColor*LightPower*specLight/distance;
    gl_FragColor = vec4(color,texture.a);

}
