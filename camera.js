function Camera(drawObjects, position, look, vMatLoc, pMatLoc, Fov, Near, Far, Canvas, vportSizeX, vportSizeY, vportOffsetX, vportOffsetY)
{
    this.vMatL   = vMatLoc;
    this.pMatL   = pMatLoc;
    this.fov = Fov;
    this.near = Near;
    this.far = Far;
    this.canvas = Canvas;
    this.vprtSizeX = vportSizeX;
    this.vprtSizeY = vportSizeY;
    this.vprtOffX = vportOffsetX;
    this.vprtOffY = vportOffsetY;
    this.drawObjs = drawObjects;
    this.vMatrix = mat4.create();
    this.setPerspective = function()
    {
        var pMatrix = mat4.create();
        mat4.identity(pMatrix);
        pMatrix = mat4.perspective(pMatrix, this.fov, (this.canvas.width*this.vprtSizeX)/(this.canvas.height*this.vprtSizeY), this.near, this.far);
        setMatrix(pMatrix,this.pMatL);
    }
    this.update = function()
    {
        this.setPerspective();
        gl.viewport(this.vprtOffX*this.canvas.width, this.vprtOffY*this.canvas.height,this.canvas.width*this.vprtSizeX, this.canvas.height*this.vprtSizeY);
        setMatrix(this.vMatrix,this.vMatL);
    }
    this.draw = function()
    {
        this.drawObjs.draw();
    }
    this.lookAtFrom= function (lookTo, from)
    {
        var up = vec3.fromValues(0,1,0);
        mat4.lookAt(this.vMatrix,from,lookTo,up);
    }
    this.update();
    this.setPerspective(); 

}
