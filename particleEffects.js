function particlesFromVertex(drawObjs, product,shaderProgram,centerPos,vertexes,scale,particleScale)
{
    this.prtcls = new Array();
    this.cPos = centerPos;
    this.verts = vertexes;
    this.scale = scale;
    var num = vertexes.length/3.0;
    console.log(num);
    for(var i=0; i<num; i++)
        this.prtcls[i]= new ParticleNoIndex(product,shaderProgram);
    for(var i=0; i<num; i++)
    {
        vec3.add(this.prtcls[i].pos,centerPos, vertexes[i]);
        this.prtcls[i].scalePt(particleScale);
    }
    this.draw = function()
    {
        for(var i=0; i<num; i++)
        {
            this.prtcls[i].draw();
        }
    }
    drawObjs.add(this);
}
function ParticleIndexed(product,shaderProgram)
{
    this.pos    = vec3.create();
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        setMatrixPRS(this.pos,this.rot,this.scale,this.mMatLoc);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}
function ParticleNoIndex(product, shaderProgram)
{
    this.pos    = vec3.create();
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0, 1.0, 1.0);
    this.vertexBuffer   =product.vB;
    this.colorBuffer    =product.cB;
    this.vPosLoc = shaderProgram.vPos;
    this.vColLoc = shaderProgram.vCol;
    this.mMatLoc = shaderProgram.mMat;
    this.shader  = shaderProgram.shader;
    this.scalePt= function(value)
    {
        this.scale = vec3.fromValues(value,value,value);
    }
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
}
