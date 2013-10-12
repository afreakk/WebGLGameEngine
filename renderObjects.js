function iRenderObject(drawObjects, product,shaderProgram,x,y,z)
{
    this.global = new Translations();
    this.global.translate(x,y,z);
    this.model = product;
    this.shader  = shaderProgram;
    this.ambien
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
            var d = Array();
            var tl = Array();
            for(var i=0; i<this.model.diffuseColors.length; i++)
                d[i] = this.model.diffuseColors[i];
            for(var i=0; i<this.model.texGLSLlocs.length; i++)
            {
                tl[i] = this.model.texGLSLlocs[i];
            }
            gl.uniform3fv(this.shader.diffuseColor, new Float32Array(d));
            gl.uniform1iv(this.shader.samplerCount, tl );
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.matIndex)
            gl.vertexAttribPointer(this.shader.materialIndex, this.model.matIndex.itemSize, gl.FLOAT, false , 0,0);
        var k=0;
        for(var j=0; j<this.model.materialNamesX.length; j++)
        {
            if(this.model.materialNamesX[j] in this.model.tB)
            {
                activateTexture(gl.TEXTURE0+k,this.model.tB[this.model.materialNamesX[j]],this.shader.texSamplers,k);
                k++;
            }
        }
        for(var i=0; i<this.model.numMeshes; i++)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
            gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
        }
	}
    drawObjects.add(this);
    
}
var voidTexture=null;
function initTextures() 
{
  white = new Image();
  white.onload = function() { generateVoidTexture(white); }
  white.src = "white.png";
}
function generateVoidTexture(white)
{
    voidTexture=gl.createTexture();    
    gl.bindTexture(gl.TEXTURE_2D, voidTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, white);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
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
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.rot = quat.create();
    this.translate = function(x,y,z)
    {
        vec3.add(this.pos,this.pos,vec3.fromValues(x,y,z));
    }
    this.setPosition = function(x,y,z)
    {
        this.pos = vec.fromValues(x,y,z);
    }
    this.rotate = function(q)
    {
        quat.multiply(this.rot,this.rot,q);
    }
    this.setRotation = function(q)
    {
        this.rot = q;
    }
    this.scale = function(x,y,z)
    {
        vec3.add(this.scale,this.scale,vec3.fromValues(x,y,z));
    }
    this.setScale = function(x,y,z)
    {
        this.scale = vec3.fromValues(x,y,z);
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
    this.getScale = function()
    {
        return this.scale;
    }
    this.getRot = function()
    {
        return this.rot;
    }
}
/*function RenderObject(drawObjects, product, shaderProgram,x,y,z)
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
