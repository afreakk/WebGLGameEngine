function iRenderObject(drawObjects, product,shaderProgram,x,y,z)
{
    this.pos    = vec3.fromValues(x,y,z);
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0, 1.0, 1.0);
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

        setMatrixPRS(this.pos,this.rot,this.scale,this.mMatLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
    drawObjects.add(this);
    
}
function RenderObject(drawObjects, product, shaderProgram,x,y,z)
{
    this.pos    = vec3.fromValues(x,y,z);
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0, 1.0, 1.0);
    this.vertexBuffer   =product.vB;
    this.colorBuffer    =product.cB;
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
        setMatrixPRS(this.pos,this.rot,this.scale,this.mMatLoc);
		gl.drawArrays(gl.TRIANGLES , 0, this.vertexBuffer.numItems);
	}
    drawObjects.add(this);
}
