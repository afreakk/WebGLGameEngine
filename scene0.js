function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    var time=0;
    var light=null;
    var dirLight = null;

    var ledge=null;
    var dk=null;
    var barrelMaster=null; 

    var skybox=null;

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
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex
        ,shaderStruct.diffColor, shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    /*    gl.enable(gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.LESS);*/
    }
    this.init = function()
    {
        pWorld = new PhysicsWorld();

        var cPos0    = vec3.fromValues(0.0,10.0,10.0);
        var cLookAt = vec3.fromValues(0.0,0.0,0.0);
        this.camera0 = new Camera(this.drawObjs, cPos0,cLookAt,shaderStruct ,  45.0,   0.1,  400.0,    this.canvas,1.0,1.0,0.0,0.0);

        var lightColor = vec3.fromValues(1.0,1.0,1.0);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 100.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,0.2);

        var ledgeBuffer = this.objs['ledge'].generateBuffers();
        var ledgePostion = vec3.fromValues(0,0,-2.5);
        ledge = new gObject(this.drawObjs, ledgeBuffer, shaderStruct, ledgePostion, 0, "convex");
        
        var dkBuffer = this.objs['dk'].generateBuffers();
        var dkPosition = vec3.fromValues(0,0.6,0);
        dk = new DKController(this.drawObjs,dkBuffer,shaderStruct,dkPosition,10.0);

        var cubeBuffer = this.objs['cube'].generateBuffers();
        var skyboxPos = vec3.fromValues(0,0,0);
        skybox = new rObject(this.drawObjs,cubeBuffer,shaderStruct,skyboxPos);
        skybox.shade = 0;
        
        barrelMaster = new BarrelMaster(this.objs['barrel'].generateBuffers(),this.drawObjs,shaderStruct);

        console.log("sceneOne initiated");
    }                                  
    this.update = function()
    {
        handleTime();
        var lDistance = 20.0;
        light.setPosition(Math.sin(time)*lDistance, 2.5, Math.cos(time)*lDistance);
        pWorld.update(dt);
        glClear();
        barrelMaster.update(time,dt);
        this.camera0.lookAt(dk.getPos());
        this.camera0.update();
        this.camera0.draw();
        dk.update();
    }
    function glClear()
    {
        gl.clearColor(0.2, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    var lastTime=0.0;
    var dt = 0.0;
    var time = 0.0;
    var startTime = new Date().getTime();
    function handleTime()
    {
        var now = new Date().getTime()-startTime;
        dt = (now-lastTime)/1000;
        time += dt;
        lastTime = now;
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
