
function ObligInitGLColors( /*in  */ diffuseColor,  specularColor,  ambientColor, 
                            /* out*/ diffColor,     specColor,      ambColor)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffuseColor),gl.STATIC_DRAW);
    diffColor.itemSize = 3;
    diffColor.numItems = diffuseColor.length/diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambientColor),gl.STATIC_DRAW);
    ambColor.itemSize = 3;
    ambColor.numItems = ambientColor.length/ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specularColor),gl.STATIC_DRAW);
    specColor.itemSize = 3;
    specColor.numItems = specularColor.length/specColor.itemSize;
}
function ObligInitGLBuffers(/*in */ vectors,normals,textureCoords, indices, materialIndex,
                            /*out*/ vB,     nB,     uvB, iB, matIdx)
{
    gl.bindBuffer(gl.ARRAY_BUFFER,uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( textureCoords),gl.STATIC_DRAW);
    uvB.itemSize=2;
    uvB.numItems = textureCoords.length/uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vectors),gl.STATIC_DRAW);
    vB.itemSize = 3;
    vB.numItems = vectors.length/vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normals), gl.STATIC_DRAW);
    nB.itemSize = 3;
    nB.numItems = normals.length/nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,matIdx);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(materialIndex),gl.STATIC_DRAW);
    matIdx.itemSize = 1;
    matIdx.numItems = materialIndex.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iB);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    iB.numItems = indices.length;
}
function obligDraw(vB,uvB,nB,diffColor,ambColor,specColor,shader,matIdx,iB)
{

    gl.bindBuffer(gl.ARRAY_BUFFER, vB);
    gl.vertexAttribPointer(shader.vPos, vB.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER,uvB);
    gl.vertexAttribPointer(shader.uvMap,   uvB.itemSize,     gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nB);
    gl.vertexAttribPointer(shader.normals, nB.itemSize, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, diffColor);
    gl.vertexAttribPointer(shader.diffColor, diffColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ambColor);
    gl.vertexAttribPointer(shader.ambColor, ambColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, specColor);
    gl.vertexAttribPointer(shader.specColor, specColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER,matIdx);
    gl.vertexAttribPointer(shader.materialIndex, matIdx.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iB);
    gl.drawElements(gl.TRIANGLES, iB.numItems, gl.UNSIGNED_SHORT, 0);


}
function makeCubeSkyBox(makeColors,vB,uvB,nB,iB,matIdx, diffColor,ambColor,specColor,size)
{
    var skyBoxGeometry = skyboxContainer(size);
    var vectors = skyBoxGeometry.skyVerts;
    var indices = skyBoxGeometry.skyIndices;
    var normals = makeSphereNormals(vectors,size);
    var diffuseColor = makeColors(indices.length);
    var specularColor = makeColors(indices.length);
    var ambientColor = makeColors(indices.length);
    var textureCoords = skyBoxGeometry.skyTexCoords;
    var matIndex = makeMatIndex(indices);
    ObligInitGLBuffers(vectors, normals, textureCoords, indices, matIndex,
                        vB,     nB,      uvB,           iB,      matIdx);
    ObligInitGLColors(diffuseColor,specularColor,ambientColor,diffColor,specColor,ambColor);
}
function makeMatIndex(indices)
{
    var matIndex = [];
    for(var i=0; i<indices.length; i++)
        matIndex.push(0);
    return matIndex;
}
function makeSphereNormals(vectors,size)
{
    normals = [];
    for(var i=0; i<vectors.length; i++)
        normals.push(vectors[i]/size);
    return normals;
}
function rCubeSkyBox(drawObjs,shaderStruct,pos,size)
{
    var shader = shaderStruct;
    var vB=            gl.createBuffer();
    var iB=            gl.createBuffer();
    var uvB =          gl.createBuffer();
    var nB =           gl.createBuffer();
    var diffColor =    gl.createBuffer();
    var ambColor =     gl.createBuffer();
    var specColor =    gl.createBuffer();
    var matIdx =       gl.createBuffer();
    this.global = new Translations();
    this.global.translate(pos);
    var textureBuffers = new Array();
    var currentTexture = null;
    init(size);
    drawObjs.add(this);
    this.draw = function() 
	{
        setShader(shader.shader);
        gl.uniform1iv(shader.samplerCount, [10,10,10,10] );
        gl.uniform1i(shader.strike, 1337 );
        if(currentTexture !== null)
            activateTexture(gl.TEXTURE0,textureBuffers[currentTexture],shader.texSamplers,0);
        setMatrix(this.global.calcMatrix(),shader.mMat);
        obligDraw(vB,uvB,nB,diffColor,ambColor,specColor,shader, matIdx, iB);
        gl.uniform1i(shader.strike, strikeCount );
	}
    function init(size)
    {
        makeCubeSkyBox(makeColors,vB,uvB,nB,iB,matIdx,diffColor,ambColor,specColor,size);
    }
    function makeColors(indicesIN)
    {
        var colorDim = 1.75;
        var colors = [];
        var colorIdx = 0;
        indices = indicesIN;
        for(var i=0; i<indices; i++)
        {
            colors.push(1.0);
            colors.push(1.0);
            colors.push(1.0);
        }
        return colors;
    }
    this.useTexture=function(url)
    {
        currentTexture = url;
        if(url in textureBuffers)
        {
            return;
        }
        else
        {
            loadTextures(url,generateTextureBuffers);
        }
    }
    function loadTextures(url, completionCallback)
    {
        var tempImg = new Image();
        tempImg.src = "imgz/"+url;
        tempImg.onload = (function() 
        {
            completionCallback(tempImg,url);
        });
    }
    function generateTextureBuffers(inImg, url)
    {
        var mipMaps = false; 
        gl.activeTexture(gl.TEXTURE0);
        var tBuffer=gl.createTexture();    
        gl.bindTexture(gl.TEXTURE_2D, tBuffer);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inImg);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipMaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        if(mipMaps)
            gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        textureBuffers[url] = tBuffer;
        currentTexture = url;
    }
    
}
