function iRenderObject(drawObjects, product,shaderProgram,x,y,z)
{
    this.global = new Translations();
    this.global.translate(x,y,z);
    this.model = product;
    this.shader  = shaderProgram;
    this.draw = function() 
	{
        setShader(this.shader.shader);
        setMatrix(this.global.calcMatrix(),this.shader.mMat);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vB);
        gl.vertexAttribPointer(this.shader.vPos, this.model.vB.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.model.uvB);
        gl.vertexAttribPointer(this.shader.uvMap,   this.model.uvB.itemSize,     gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.nB);
        gl.vertexAttribPointer(this.shader.normals, this.model.nB.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.diffColor);
        gl.vertexAttribPointer(this.shader.diffColor, this.model.diffColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.ambColor);
        gl.vertexAttribPointer(this.shader.ambColor, this.model.ambColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.specColor);
        gl.vertexAttribPointer(this.shader.specColor, this.model.specColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.matIndex)
        gl.vertexAttribPointer(this.shader.materialIndex, this.model.matIndex.itemSize, gl.FLOAT, false , 0,0);

        gl.uniform1iv(this.shader.samplerCount, this.model.texGLSLlocs );
        for(var j=0, k=0; j<this.model.indexedMaterialNames.length; j++)
        {
            if(this.model.indexedMaterialNames[j] in this.model.tB)
                activateTexture(gl.TEXTURE0+k,this.model.tB[this.model.indexedMaterialNames[j]],this.shader.texSamplers,k++);
        }
        for(var i=0; i<this.model.numMeshes; i++)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
            gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
        }
	}
    drawObjects.add(this);
    
}
function activateTexture(texturecount,texture,textureSamplers, index)
{
    gl.activeTexture(texturecount);
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(textureSamplers[index],index);
}
function Translations()
{
    this.pos = vec3.create();
    this.rot = quat.create();
    this.translate = function(x,y,z)
    {
        vec3.add(this.pos,this.pos,vec3.fromValues(x,y,z));
    }
    this.setPosition = function(x,y,z)
    {
        this.pos = vec3.fromValues(x,y,z);
    }
    this.rotate = function(q)
    {
        quat.multiply(this.rot,this.rot,q);
    }
    this.setRotation = function(q)
    {
        this.rot = q;
    }
    this.lookAt = function(vec)
    {
        var nVec = vec3.create();
        var nPos = vec3.create();
        vec3.normalize(nVec,vec);
        vec3.normalize(nPos,this.pos);
        this.rot = quat.rotationTo(this.rot,nVec,nPos);
    }
    this.calcMatrix = function()
    {
        var cMatrix = mat4.create();
        mat4.fromRotationTranslation(cMatrix,this.rot,this.pos);
        return cMatrix;
    }    
    this.getPos = function()
    {
        return this.pos;
    }
    this.getRot = function()
    {
        return this.rot;
    }
}
/*unIndexed objects,, dont know when ill ever use them also very outdated,needs revamp before using
function RenderObject(drawObjects, product, shaderProgram,x,y,z)
{
    this.translate(x,y,z);
    var vertexBuffer   =product.vB;
    var colorBuffer    =product.cB;
    var vPosLoc = shaderProgram.vPos;
    var vColLoc = shaderProgram.vCol;
    var shader  = shaderProgram.shader;
    var mMatLoc = shaderProgram.mMat;
    this.draw = function() 
	{
        setShader(shader);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vPosLoc, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(vColLoc, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrix(calcMatrix(),mMatLoc);
		gl.drawArrays(gl.TRIANGLES , 0, vertexBuffer.numItems);
	}
    drawObjects.add(this);
}
RenderObject.prototype = new Translations();
*/
