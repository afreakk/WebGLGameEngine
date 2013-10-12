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
uniform vec3 diffColor[12];
uniform int samplerCount[4];
varying float lightVertDistance;
varying vec3 EyeDirection_cameraspace;
varying vec3 help;
varying float matIndexF;
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
    float specular = pow(cosAlpha, 5.0);
    vec3 dColor= vec3(1.0,1.0,1.0);
    if(matIndex == 0)
        dColor = diffColor[0];
    else if(matIndex == 1)
        dColor = diffColor[1];
    else if(matIndex == 2)
        dColor = diffColor[2];
    else if(matIndex == 3)
        dColor = diffColor[3];
    else if(matIndex == 4)
        dColor = diffColor[4];
    else if(matIndex == 5)
        dColor = diffColor[5];
    else if(matIndex == 6)
        dColor = diffColor[6];
    else if(matIndex == 7)
        dColor = diffColor[7];
    else if(matIndex == 8)
        dColor = diffColor[8];
    else if(matIndex == 9)
        dColor = diffColor[9];
    else if(matIndex == 10)
        dColor = diffColor[10];
    else if(matIndex == 11)
        dColor = diffColor[11];
    vec3 color = dColor * LightColor * LightPower * (cosTheta+specular) / (lightVertDistance*lightVertDistance);    
    vec4 texture = vec4(1.0, 1.0, 1.0, 1.0);
    if(matIndex == samplerCount[0])
        texture = texture2D(texSampler0,uvCoords);
    else if(matIndex == samplerCount[1])
        texture = texture2D(texSampler1,uvCoords);
    else if(matIndex == samplerCount[2])
        texture = texture2D(texSampler2,uvCoords);
    else if(matIndex == samplerCount[3])
        texture = texture2D(texSampler3,uvCoords);
    vec4 endColor = vec4(color,1.0) * texture;
    gl_FragColor = endColor;

}
