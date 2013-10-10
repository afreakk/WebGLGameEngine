function SceneOne(Objs)
{
    this.initiated=false;
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    var cobble=null;
    var cat=null;
    var time=0;
    this.canvas=null;
    this.camera0=null;
    this.camera1=null;
    this.drawObjs = new DrawableObjects();
    this.objs = Objs;
    this.GLSettings= function()
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        shaderStruct = new getShaderStruct(shader);
        setShader(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap]);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }
    this.init = function()
    {
        this.GLSettings(); 
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cPos1   = vec3.fromValues(-5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        this.camera0 = new Camera(this.drawObjs, cPos0,cLookAt,shaderStruct.vMat,shaderStruct.pMat,  45.0,   0.1,  100.0,    this.canvas,1.0,1.0,0.0,0.0);
        var catM = this.objs['cat'];
        var cobbleM = this.objs['cobble'];
        //var treeM = this.objs['tree'];
        cat = new iRenderObject(this.drawObjs, catM.generateBuffers(), shaderStruct,0.0,-0.5,-0.5);
        //cobble = new iRenderObject(this.drawObjs, cobbleM.generateBuffers(), shaderStruct, 0.0, -1.0, 0.0);
        //tree = new iRenderObject(this.drawObjs, treeM.generateBuffers(), shaderStruct, 0.0,0.0,0.0);
        var turn = quat.fromValues(0,1,0,0);
        cat.global.rotate(turn);
        console.log("sceneOne initiated");
        this.initiated=true;
    }                                  
    this.update = function()
    {
        glClear();
        this.catPut();
        var distance = vec3.fromValues(0,0.7,1.2);
        var cPos0=vec3.create();
        cPos0 = vec3.add(cPos0,cat.global.getPos(),distance);
        var cLook = cat.global.getPos();
        this.camera0.lookAtFrom(cLook,cPos0);
        this.camera0.update();
        this.camera0.draw();
        cat.global.setScale(10.0,10.0,10.0);
        time += 0.01;
    }
    this.catPut = function() 
    {
        var speed = 0.01;
        var rotAmntP = quat.create();
        var rotAmntM = quat.create();
        var axis = vec3.fromValues(0,1,0);
        quat.setAxisAngle(rotAmntP,axis,toRad(1.0));
        quat.setAxisAngle(rotAmntM,axis,toRad(-1.0));
        if(key.Up)
           cat.global.translate(0,0,-speed); 
        if(key.Down)
            cat.global.translate(0,0,speed);
        if(key.Left)
            cat.global.translate(-speed,0,0);
        if(key.Right)
            cat.global.translate(speed,0,0);
        if(key.Q)
            cat.global.rotate(rotAmntP);
        if(key.E)
            cat.global.rotate(rotAmntM);

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
