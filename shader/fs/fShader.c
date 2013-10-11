precision mediump float;
varying vec2 uvCoords;
varying vec3 Normal_cameraspace;
varying vec3 LightDirection_cameraspace;
uniform int texCount;
uniform vec3 MaterialDiffuseColor;
uniform vec3 LightColor;
uniform float LightPower;
uniform sampler2D texSampler0;
varying float lightVertDistance;
varying vec3 EyeDirection_cameraspace;
varying vec3 help;
void main(void) {
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
    vec3 color = MaterialDiffuseColor * LightColor * LightPower * (cosTheta+specular) / (lightVertDistance*lightVertDistance);    
    vec4 texture = texture2D(texSampler0,uvCoords);
    gl_FragColor = vec4(color,1.0)*texture;

}
