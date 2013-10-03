function setMatrix(matrix,matLoc)
{
    gl.uniformMatrix4fv(matLoc,false,matrix);
}
function quatFromMatrix(matrix) {
	var w = Math.sqrt(1.0 + matrix[0] + matrix[5] + matrix[10]) / 2.0;
	var w4 = (4.0 * w);
	var x = (matrix[6] - matrix[9]) / w4 ;
	var y = (matrix[8] - matrix[2]) / w4 ;
	var z = (matrix[1] - matrix[4]) / w4 ;
    return quat.fromValues(x, y, z, w);
}
function setMatrixPR(posV, rotQ, matLoc) 
{
    var modelMatrix= mat4.create();
    modelMatrix = mat4.fromRotationTranslation(modelMatrix, rotQ, posV);
    gl.uniformMatrix4fv(matLoc, false, modelMatrix);
}
function Camera(position, look, viewMatrix)
{
    this.pos    = position;
    this.rot    = quat.create();
    this.vMat   = viewMatrix;
    this.lookAt = function(center)
    {
        var tempMat = mat4.create();
        var up = vec3.fromValues(0.0, 1.0, 0.0);
        mat4.lookAt(tempMat,this.pos,center,up);
        this.rot = quatFromMatrix(tempMat);
        setMatrix(tempMat,this.vMat);
    }
    this.lookAtFrom = function(center,position)
    {
        this.pos = position;
        var tempMat = mat4.create();
        var up = vec3.fromValues(0.0, 1.0, 0.0);
        mat4.lookAt(tempMat,this.pos,center,up);
        this.rot = quatFromMatrix(tempMap);
        setMatrix(tempMat,vMat);
    }
    this.update = function()
    {
        setMatrixPR(this.pos,this.rot,vMat);
    }
    
    this.lookAt(look);

}
