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
uniform float alpha;
uniform float iGlobalTime;
uniform int strike;
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
vec3 fractal()
{     
    vec2 position = uvCoords*100000.0;

     float cX = position.x - 0.5;
     float cY = position.y - 0.5;

     float newX = log(sqrt(cX*cX + cY*cY));
     float newY = atan(cX, cY);
     
     float color = 0.0;
     color += cos( newX * cos(iGlobalTime / 15.0 ) * 80.0 ) + cos( newX * cos(iGlobalTime / 15.0 ) * 10.0 );
     color += cos( newY * cos(iGlobalTime / 10.0 ) * 40.0 ) + cos( newY * sin(iGlobalTime / 25.0 ) * 40.0 );
     color += cos( newX * cos(iGlobalTime / 5.0 ) * 10.0 ) + sin( newY * sin(iGlobalTime / 35.0 ) * 80.0 );
     color *= cos(iGlobalTime / 10.0 ) * 0.5;

     return vec3( color, color * 0.5, sin( color + iGlobalTime / 3.0 ) * 0.75 );

}
vec3 hFrac()
{
	vec2 uv = (uvCoords)*200000.0;
	float pwr = iGlobalTime;

	float ww = 0.01;

	uv.y += 0.1;
	vec3 str;
	pwr /=4.0;
	uv.y += ((pwr) *(1.0* sin(uv.x*3.14*2.0  +iGlobalTime*2.0) ));
	ww = tan(uv.y);
	str = vec3(pwr*0.1 , pwr*0.1, pwr);
	if(ww>1.0+pwr)
		str = vec3(ww*0.1 , ww*0.1, ww*0.1 );
	if(ww<0.4+pwr)
		ww=0.0;
	if(ww>0.4+pwr && ww<0.6+pwr)
		str = vec3(ww*0.2 , ww*0.2,ww);
	if(ww>0.6+pwr && ww<0.8+pwr)
		str = vec3(0.0, 0.0, ww*0.9 );
	if(ww>0.8&&ww<1.0)
		str = vec3(ww*0.1 , ww*0.1, ww*0.8 );
	
    return str;
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
    texture = vec4(1.0, 1.0, 1.0, texture.a);
    float distance = lightVertDistance*lightVertDistance;
    vec3 pointLight = DiffuseSpecPoint(Normal_cameraspace,LightDirection_cameraspace,EyeDirection_cameraspace,texture.rgb,pow(distance,2.0));
    vec3 directionLight = DiffuseSpecDirection(Normal_cameraspace,DirectionalLight,EyeDirection_cameraspace,texture.rgb);
    vec3 endColor = ambientColor+pointLight+directionLight;
    vec3 frClr= vec3(1.0,1.0,1.0);
    if(strike == 1)
    {
        frClr = hFrac();
        float minVal = 0.15; 
        endColor *= vec3(max(minVal,frClr.r),max(minVal,frClr.g),max(minVal,frClr.b));
    }
    else if(strike == 2)
    {
        frClr = hFrac();
        float minVal = 0.1; 
        endColor *= vec3(max(minVal,frClr.r),max(minVal,frClr.g),max(minVal,frClr.b));
    }
    gl_FragColor = vec4(endColor,texture.a*alpha*((min(frClr.r,1.0)+min(frClr.g,1.0)+min(frClr.b,1.0))/3.0));

}
