function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    this.obj0=null;
    this.obj1=null;
    this.time=0;
    this.canvas=null;
    this.camera0=null;
    this.camera1=null;
    this.drawObjs = new DrawableObjects();
    this.objs = Objs;
    this.party = null;
    this.GLSettings= function()
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        shaderStruct = new getShaderStruct(shader);
        setShader(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.vCol]);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }
    this.init = function()
    {
        this.GLSettings(); 
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cPos1   = vec3.fromValues(-5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        this.camera0 = new Camera(this.drawObjs, cPos0,cLookAt,shaderStruct.vMat,shaderStruct.pMat,  45.0,   0.1,  100.0,    this.canvas,1.0,0.5,0.0,0.5);
        this.camera1 = new Camera(this.drawObjs, cPos1,cLookAt,shaderStruct.vMat,shaderStruct.pMat,  45.0,   0.1,  100.0,    this.canvas,1.0,0.5);
        var cat = this.objs['cat'];
        var catB = cat.generateBuffers();
        obj1 = new iRenderObject(this.drawObjs, catB, shaderStruct,0.0,-0.5,-0.5);
        console.log("sceneOne initiated");
    }                                  
    this.update = function()
    {
        glClear();
        var range = 1.5;
        var cPos0 = vec3.fromValues(Math.sin(this.time)*range,0.0,Math.cos(this.time)*range);
        var cPos1 = vec3.fromValues(Math.cos(this.time)*range,0.0,Math.sin(this.time)*range);
        var cLook = vec3.fromValues(0.0,0.0,-0.0);
        this.camera0.lookAtFrom(cLook,cPos0);
        this.camera1.lookAtFrom(cLook,cPos1);
        this.camera0.update();
        this.camera0.draw();
        this.camera1.update();
        this.camera1.draw();
        this.time += 0.01;
    }
    function glClear()
    {
        gl.clearColor(0.2, 0.2, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

function SceneTwo()
{
    this.endScene=false;
    this.nextLvl=0;
    this.init = function()
    {
        alert("SceneTwo not implemented");
    }
    this.update = function()
    {
    }
}
