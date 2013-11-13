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
uniform vec3 DirectionalLight;
uniform float DirectionalPower;
varying float lightVertDistance;
varying vec3 EyeDirection_cameraspace;
varying float matIndexF;
varying vec3 diffuseColor;
varying vec3 ambientColor;
varying vec3 specularColor;
vec3 DiffuseSpecPoint(vec3 normal_camSpace, vec3 lightDir_camSpace,vec3 eyeDir_camSpace,vec3 textureRGB, float distance)
{
    // Normal of the computed fragment, in camera space
    vec3 n = normalize( normal_camSpace);
    // Direction of the light (from the fragment to the light)
    vec3 l = normalize( lightDir_camSpace );
    float cosTheta = clamp( dot( n,l ), 0.0, 1.0 );
    // Eye vector (towards the camera)
    vec3 E = normalize(eyeDir_camSpace);
    // Direction in which the triangle reflects the light
    vec3 R = reflect(-l,n);
    // Cosine of the angle between the Eye vector and the Reflect vector,
    // clamped to 0
    //  - Looking into the reflection -> 1
    //  - Looking elsewhere -> < 1
    float cosAlpha = clamp( dot( E,R ), 0.0,1.0 );
    float powCA = pow(cosAlpha, 5.0);
    vec3 diffuseShading = (diffuseColor*textureRGB)*LightColor*LightPower*cosTheta/distance;
    vec3 specularShading = specularColor*LightColor*LightPower*powCA/distance;
    return diffuseShading+specularShading;
}
vec3 DiffuseSpecDirection(vec3 normal_camSpace, vec3 lightDir, vec3 eyeDir_camSpace,vec3 textureRGB)
{
    // Normal of the computed fragment, in camera space
    vec3 n = normalize( normal_camSpace);
    // Direction of the light (from the fragment to the light)
    vec3 l = normalize( lightDir );
    float cosTheta = clamp( dot( n,l ), 0.0, 1.0 );
    // Eye vector (towards the camera)
    vec3 E = normalize(eyeDir_camSpace);
    // Direction in which the triangle reflects the light
    vec3 R = reflect(-l,n);
    // Cosine of the angle between the Eye vector and the Reflect vector,
    // clamped to 0
    //  - Looking into the reflection -> 1
    //  - Looking elsewhere -> < 1
    float cosAlpha = clamp( dot( E,R ), 0.0,1.0 );
    float powCA = pow(cosAlpha, 5.0);
    vec3 directionPower = vec3(1.0,1.0,1.0)*DirectionalPower;
    vec3 diffuseShading = (diffuseColor*textureRGB)*LightColor*directionPower*cosTheta;
    vec3 specularShading = specularColor*LightColor*directionPower*powCA;
    return diffuseShading+specularShading;
}
void main(void) {
    highp int matIndex = int(matIndexF);
    vec4 texture = vec4(1.0, 1.0, 1.0, 1.0);
    if(matIndex == samplerCount[0])
        texture = texture2D(texSampler0,uvCoords);
    else if(matIndex == samplerCount[1])
        texture = texture2D(texSampler1,uvCoords);
    else if(matIndex == samplerCount[2])
        texture = texture2D(texSampler2,uvCoords);
    else if(matIndex == samplerCount[3])
        texture = texture2D(texSampler3,uvCoords);
    if(texture.a<0.2)
        discard;
    float distance = lightVertDistance*lightVertDistance;
    vec3 pointLight = DiffuseSpecPoint(Normal_cameraspace,LightDirection_cameraspace,EyeDirection_cameraspace,texture.rgb,distance);
    vec3 directionLight = DiffuseSpecDirection(Normal_cameraspace,DirectionalLight,EyeDirection_cameraspace,texture.rgb);
    vec3 endColor = ambientColor+pointLight+directionLight;
    gl_FragColor = vec4(endColor,texture.a);

}
