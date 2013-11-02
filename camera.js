function Camera(drawObjects, position, look,shader , Fov, Near, Far, Canvas, vportSizeX, vportSizeY, vportOffsetX, vportOffsetY)
{
    this.pos    = position;
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0,1.0,1.0);
    this.vMatL   = shader.vMat;
    this.pMatL   = shader.pMat;
    this.fov = Fov;
    this.near = Near;
    this.far = Far;
    this.canvas = Canvas;
    this.vprtSizeX = vportSizeX;
    this.vprtSizeY = vportSizeY;
    this.vprtOffX = vportOffsetX;
    this.vprtOffY = vportOffsetY;
    this.drawObjs = drawObjects;
    this.mtrx = mat4.create();
    this.setPerspective = function()
    {
        var pMatrix = mat4.create();
        mat4.identity(pMatrix);
        pMatrix = mat4.perspective(pMatrix, this.fov, (this.canvas.width*this.vprtSizeX)/(this.canvas.height*this.vprtSizeY), this.near, this.far);
        setMatrix(pMatrix,this.pMatL);
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
        tempMat = mat4.lookAt(tempMat, this.pos,center,up);
        this.mtrx = tempMat;               //enten saa funker ikek setMatrixPR som den skal ELLER så funker ikke matToQuat som den skal, noe er galt iaf
    }                                      //overrider setmatrixPR med setmatrix this.mtrx,, ta tak i det !! todooo i morra
    this.update = function()
    {
        this.setPerspective();
        gl.viewport(this.vprtOffX*this.canvas.width, this.vprtOffY*this.canvas.height,this.canvas.width*this.vprtSizeX, this.canvas.height*this.vprtSizeY);
        setMatrix(this.mtrx,this.vMatL);
    }
    this.draw = function()
    {
        this.drawObjs.draw();
    }
    this.update();
    this.setPerspective(); 
    this.lookAt(look);

}
