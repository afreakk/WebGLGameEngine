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

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// I've not seen anybody out there computing correct cell interior distances for Voronoi
// patterns yet. That's why they cannot shade the cell interior correctly, and why you've
// never seen cell boundaries rendered correctly. 
//
// However, here's how you do mathematically correct distances (note the equidistant and non
// degenerated grey isolines inside the cells) and hence edges (in yellow):
//
// http://www.iquilezles.org/www/articles/voronoilines/voronoilines.htm


#define ANIMATE

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return fract(sin(p)*43758.5453);
}

vec3 voronoi( in vec2 x )
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	vec2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2(float(i),float(j));
		vec2 o = hash( n + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iGlobalTime + 6.2831*o );
        #endif	
        vec2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = hash( n + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iGlobalTime + 6.2831*o );
        #endif	
        vec2 r = g + o - f;

		
        if( dot(mr-r,mr-r)>0.000001 )
		{
        // distance to line		
        float d = dot( 0.5*(mr+r), normalize(r-mr) );

        md = min( md, d );
		}
    }

    return vec3( md, mr );
}

vec3 voro(float scale )
{
    vec2 p = uvCoords*scale;

    vec3 c = voronoi( 8.0*p );

	// isolines
    vec3 col = c.x*(0.5 + 0.5*sin(64.0*c.x))*vec3(1.0);
    // borders	
    col = mix( vec3(1.0,0.6,0.0), col, smoothstep( 0.04, 0.07, c.x ) );
    // feature points
	float dd = length( c.yz );
	col = mix( vec3(1.0,0.6,0.1), col, smoothstep( 0.0, 0.12, dd) );
	col += vec3(1.0,0.6,0.1)*(1.0-smoothstep( 0.0, 0.04, dd));

	return col;
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
    vec3 frClr;
    float multiPlier = floor(float(strike));
    frClr= voro(multiPlier)*multiPlier/3.0;
    float minVal = 0.1; 
    endColor *= frClr;
    gl_FragColor = vec4(endColor,texture.a*alpha*((min(frClr.r,1.0)+min(frClr.g,1.0)+min(frClr.b,1.0))/1.0));

}
