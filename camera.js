function setProjection(fov,near,far,matLoc,canvas) 
{
    var pMatrix = mat4.create();
    mat4.identity(pMatrix);
    pMatrix = mat4.perspective(pMatrix, fov, canvas.width/canvas.height, near, far);
    gl.uniformMatrix4fv(matLoc, false, pMatrix);
}
function matToQuat(matrix) {
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
function Camera(position, look, vMatLoc, pMatLoc, Fov, Near, Far, Canvas, vportSizeX, vportSizeY, vportOffsetX, vportOffsetY)
{
    this.pos    = position;
    this.rot    = quat.create();
    this.vMatL   = vMatLoc;
    this.pMatL   = pMatLoc;
    this.fov = Fov;
    this.near = Near;
    this.far = Far;
    this.canvas = Canvas;
    this.vprtSizeX = vportSizeX;
    this.vprtSizeY = vportSizeY;
//    if(vportOffsetX)
  //  {
 //       this.vprtOffX = vportOffsetX;
//        this.vprtOffY vportOffsetY;
 /*   }
    else
    {
        this.vprtOffX = 0;
        this.vprtOffY = 0;
    }*/
    this.vprtOffX = vportOffsetX;
    this.vprtOffY = vportOffsetY;
    this.setPerspective = function()
    {
        var pMatrix = mat4.create();
        mat4.identity(pMatrix);
        pMatrix = mat4.perspective(pMatrix, this.fov, (this.canvas.width*this.vprtSizeX)/(this.canvas.height*this.vprtSizeY), this.near, this.far);
        setMatrix(pMatrix,this.pMatL);
    }
    this.updateViewport = function()
    {
 //       gl.viewport(0, 0, this.vprtSizeX,this.vprtSizeY);
        gl.viewport(this.vprtOffX, this.vprtOffY,this.canvas.width*this.vprtSizeX, this.canvas.height*this.vprtSizeY);
    }
    this.lookAt = function(center)
    {
        var tempMat = mat4.create();
        var up = vec3.fromValues(0.0, 1.0, 0.0);
        mat4.lookAt(tempMat,this.pos,center,up);
        this.rot = matToQuat(tempMat);
        setMatrix(tempMat,this.vMatL);
    }
    this.lookAtFrom = function(center,position)
    {
        this.pos = position;
        var tempMat = mat4.create();
        var up = vec3.fromValues(0.0, 1.0, 0.0);
        mat4.lookAt(tempMat,this.pos,center,up);
        this.rot = matToQuat(tempMap);
        setMatrix(tempMat,vMatL);
    }
    this.update = function()
    {
        setMatrixPR(this.pos,this.rot,vMatL);
    }
    this.setViewport= function(x,y)
    {
        this.vprtSizeX=x;
        this.vprtSizeY=y;
    }
    this.updateViewport();
    this.setPerspective(); 
    this.lookAt(look);

}
