function iRenderObject(drawObjects, product,shaderProgram,x,y,z)
{
    this.global = new Translations();
    this.global.translate(x,y,z);
    this.vertexBuffer   =   product.vB;  
    this.colorBuffer    =   product.cB;
    this.indexBuffer    =   product.iB;
    this.vPosLoc = shaderProgram.vPos;
    this.vColLoc = shaderProgram.vCol;
    this.mMatLoc = shaderProgram.mMat;
    this.shader  = shaderProgram.shader;
    this.draw = function() 
	{
        setShader(this.shader);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vPosLoc, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.vColLoc, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        setMatrix(this.global.calcMatrix(),this.mMatLoc);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
    drawObjects.add(this);
    
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
