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
    var amy=null;
    var hill=null;
    var cube= null;
    var sand = null;
    var dirLight = null;
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
    /*    gl.enable(gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.LESS);*/
    }
    this.init = function()
    {
        pWorld = new PhysicsWorld();
        this.GLSettings(); 
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cPos1   = vec3.fromValues(-5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        this.camera0 = new Camera(this.drawObjs, cPos0,cLookAt,shaderStruct.vMat,shaderStruct.pMat,  45.0,   0.1,  300.0,    this.canvas,1.0,1.0,0.0,0.0);
        var catM = this.objs['cat'];
        var treeM = this.objs['tree'];
        var tedM = this.objs['ted'];
        var amyM= this.objs['amy']; 
        var hillM = this.objs['hill'];
        var cubeM = this.objs['cube'];
        var sandM = this.objs['sand'];
        cat = new gObject(this.drawObjs, catM.generateBuffers(), shaderStruct,vec3.fromValues(10.0,20.0,-5.0),11);
        tree = new gObject(this.drawObjs, treeM.generateBuffers(), shaderStruct, vec3.fromValues(30.0,10.0,-15.0),150);
        ted = new gObject(this.drawObjs, tedM.generateBuffers(), shaderStruct, vec3.fromValues(-5,42,40.0),20);
        amy = new gObject(this.drawObjs, amyM.generateBuffers(), shaderStruct, vec3.fromValues(5.0, 10.0, -10.0),10);
        cube = new gObject(this.drawObjs, cubeM.generateBuffers(), shaderStruct, vec3.fromValues(2.0, 10.0, 1.0),10);
        sand = new gObject(this.drawObjs, sandM.generateBuffers(), shaderStruct, vec3.fromValues(0.0, -9.0, 0.0),0);
        debugDraw = new DebugDraw(this.drawObjs,new ObligTerning(1.0),shaderStruct,vec3.fromValues(0.0, 10.0, -5.0, 137));
        var lightColor = vec3.fromValues(1.0,1.0,1.0);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 100.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,0.2);
        console.log("sceneOne initiated");
    }                                  
    this.update = function()
    {
        var lDistance = 20.0;
        light.global.setPosition(Math.sin(time)*lDistance, 2.5, Math.cos(time)*lDistance);
        pWorld.update();
        glClear();
        light.update();
        var rotateZ = quat.create();
        quat.setAxisAngle(rotateZ,vec3.fromValues(0,0,1),time);
        this.catPut(ted);
        this.camera0.update();
        this.camera0.draw();
        time += 0.02;
    }
    this.catPut = function(model) 
    {
        var distance = 10.0;
        var sensitivity = 1000.0;
        var cPos0=vec3.fromValues(Math.sin(mouse.x/sensitivity)*distance, mouse.y/distance, Math.cos(mouse.x/sensitivity)*distance);
        vec3.add(cPos0,cPos0,model.global.getPos());
        var cLook = model.global.getPos();
        this.camera0.lookAtFrom(cLook,cPos0);
        var speed = 1000.1;
        var rotAmntP = quat.create();
        var rotAmntM = quat.create();
        var axis = vec3.fromValues(0,1,0);
        quat.setAxisAngle(rotAmntP,axis,toRad(1.0));
        quat.setAxisAngle(rotAmntM,axis,toRad(-1.0));
        ted.rigidBody.activate();
        if(model.global.getPos()[1]<10.0&&key.SPACE)
            model.rigidBody.applyCentralForce(new Ammo.btVector3(0,speed,0))
        if(key.Up)
           model.rigidBody.applyCentralForce(new Ammo.btVector3(0,0,-speed)); 
        if(key.Down)
            model.rigidBody.applyCentralForce(new Ammo.btVector3(0,0,speed));
        if(key.Left)
            model.rigidBody.applyCentralForce(new Ammo.btVector3(-speed,0,0));
        if(key.Right)
            model.rigidBody.applyCentralForce(new Ammo.btVector3(speed,0,0));
        if(key.Q)
            model.global.rotate(rotAmntP);
        if(key.E)
            model.global.rotate(rotAmntM);

    }
    function glClear()
    {
        gl.clearColor(0.2, 0.0, 1.0, 1.0);
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
