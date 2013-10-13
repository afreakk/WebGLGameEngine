function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    var time=0;
    var light=null;
    var cat=null;
    var tree=null;
    var ted=null;
    var ironMan=null;
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
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex,shaderStruct.diffColor, shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.LESS);
    }
    this.init = function()
    {
        this.GLSettings(); 
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cPos1   = vec3.fromValues(-5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        this.camera0 = new Camera(this.drawObjs, cPos0,cLookAt,shaderStruct.vMat,shaderStruct.pMat,  45.0,   0.1,  100.0,    this.canvas,1.0,1.0,0.0,0.0);
        var catM = this.objs['cat'];
        var treeM = this.objs['tree'];
        var tedM = this.objs['ted'];
        var ironManM= this.objs['amy']; 
        cat = new iRenderObject(this.drawObjs, catM.generateBuffers(), shaderStruct,0.0,-0.5,-0.5);
        tree = new iRenderObject(this.drawObjs, treeM.generateBuffers(), shaderStruct, 2.0,-2.0,-15.0);
        ted = new iRenderObject(this.drawObjs, tedM.generateBuffers(), shaderStruct, -5,-2,-5.0);
        ironMan = new iRenderObject(this.drawObjs, ironManM.generateBuffers(), shaderStruct, 5.0, -0.0, -10.0);
        var turn = quat.fromValues(0,1,0,0);
        cat.global.rotate(turn);
        var lightColor = vec3.fromValues(1.0,1.0,1.0);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new Light(shaderStruct, 20.0,lightColor, lightPos);
        console.log("sceneOne initiated");
    }                                  
    this.update = function()
    {
        glClear();
        light.update();
        cat.global.lookAt(ted.global.getPos());
        this.catPut(ted);
        this.camera0.update();
        this.camera0.draw();
        time += 0.01;
    }
    this.catPut = function(model) 
    {
        var distance = 10.0;
        var sensitivity = 1000.0;
        var cPos0=vec3.fromValues(Math.sin(mouse.x/sensitivity)*distance, mouse.y/distance, Math.cos(mouse.x/sensitivity)*distance);
        vec3.add(cPos0,cPos0,model.global.getPos());
        var cLook = model.global.getPos();
        this.camera0.lookAtFrom(cLook,cPos0);
        var speed = 0.1;
        var rotAmntP = quat.create();
        var rotAmntM = quat.create();
        var axis = vec3.fromValues(0,1,0);
        quat.setAxisAngle(rotAmntP,axis,toRad(1.0));
        quat.setAxisAngle(rotAmntM,axis,toRad(-1.0));
        if(key.Up)
           model.global.translate(0,0,-speed); 
        if(key.Down)
            model.global.translate(0,0,speed);
        if(key.Left)
            model.global.translate(-speed,0,0);
        if(key.Right)
            model.global.translate(speed,0,0);
        if(key.Q)
            model.global.rotate(rotAmntP);
        if(key.E)
            model.global.rotate(rotAmntM);

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
