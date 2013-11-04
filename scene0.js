function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    this.noInit=false;
    var time=0;
    var light=null;
    var dirLight = null;

    var dk=null;
    var barrelMaster=null; 
    var barrelBuffer=null;

    var skybox=null;

    var peach= null;

    this.canvas=null;
    this.camera0=null;
    this.camera1=null;
    this.drawObjs = new DrawableObjects();
    this.objs = Objs;
    var dkBuffer = null;
    var dkPosition = null;
    this.GLSettings= function()
    {
        this.endScene=false;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }
    this.resetLvl = function()
    {
        setShader(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex
        ,shaderStruct.diffColor, shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        label.title = "KM/H";
        barrelMaster.reset();
        dk.reset();
        pWorld.update(1/60.0);
    }
    this.loadShaders=function()
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        shaderStruct = new getShaderStruct(shader);
        setShader(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex
        ,shaderStruct.diffColor, shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
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
        dirLight = new DirectionalLight(shaderStruct,direction,0.5);

        var ledgeBuffer = this.objs['ledge'].generateBuffers();
        for(var i=0; i<10; i++)
        {
            var ledgePostion = vec3.fromValues(0,0,-2.5-i*20.00);
            var ledge = new gObject(this.drawObjs, ledgeBuffer, shaderStruct, ledgePostion, 0, "box",vec3.fromValues(10.0,0.5,10.0));
        }

        var peachPos=vec3.fromValues(0.0, 1.0, -180);
        var peachBuffer = this.objs['peach'].generateBuffers();
        peach = new rObject(this.drawObjs, peachBuffer, shaderStruct, peachPos);
        
        dkBuffer = this.objs['dk'].generateBuffers();
        dkPosition = vec3.fromValues(0,0.6,0);
        dk = new DKController(this.drawObjs,dkBuffer,shaderStruct,dkPosition,10.0);

        var cubeBuffer = this.objs['cube'].generateBuffers();
        var skyboxPos = vec3.fromValues(0,0,0);
        skybox = new rObject(this.drawObjs,cubeBuffer,shaderStruct,skyboxPos);
        skybox.shade = 0;
        
        barrelBuffer = this.objs['barrel'].generateBuffers();
        barrelMaster = new BarrelMaster(barrelBuffer,this.drawObjs,shaderStruct);

        console.log("sceneOne initiated");
        this.noInit = true;
    }                                  
    this.update = function()
    {
        handleTime();
        var lDistance = 20.0;
        light.setPosition(Math.sin(time)*lDistance, 2.5, Math.cos(time)*lDistance);
        pWorld.update(1/60.0);
        if(pWorld.collideHigherThan(dk.getBody(), 0.0 ))
        {
            this.endScene= true;
            endTitle = "GAME OVER";
            endText = "You died, press space to try again.";
        }
        else if(dk.getZ()< -175)
        {
            barrelMaster.decreaseTimeBetween();
            this.endScene = true;
            endTitle = "Mission Accomplished";
            endText = "Congratulations, you saved princess peach! Press space to play the next difficulty.";
            lvlLabel.text += 1;
        }
        glClear();
        var distanceFromDK = 40.0;
        var barrelZ = dk.getZ();
        barrelZ -= distanceFromDK;
        barrelMaster.setZ(barrelZ);
        barrelMaster.update(time,dt);
        var cameraPos = vec3.create();
        vec3.add(cameraPos,dk.getPos(),vec3.fromValues(0.0,2.5,5.0));
        this.camera0.lookAtFrom(dk.getPos(),cameraPos);
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
        label.text = (Math.abs(dk.getSpeed())).toFixed(2);
        panel.clear();
        label.draw();
        lvlLabel.draw();
    }
}
var endTitle;
var endText; 
function SceneTwo()
{
    this.canvas=null;
    this.endScene=false;
    this.nextLvl=0;
    this.shaderStruct=null;
    this.noInit=false;
    var vPos = null;
    var squareVertexPositionBuffer = null;
    var timeLoc = null;
    var shader = null;
    this.GLSettings= function()
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        this.endScene=false;
        key.SPACE = false;
    }
    this.loadShaders=function()
    {
        shader = getShader(gl,"vs/vJollyShader","fs/fJollyShader");
        setShader(shader);
        vPos= gl.getAttribLocation(shader, "vPos");
        timeLoc = gl.getUniformLocation(shader, "time");
    }
    this.init = function()
    {
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
             1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
            -1.0, -1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        label.title = endTitle;
        label.text = endText;
        panel.clear();
        label.draw();
        this.noInit=true;
    }
    this.update = function()
    {
        handleTime();
        gl.uniform1f(timeLoc, time);
        glClear();
        gl.bindBuffer(gl.ARRAY_BUFFER,squareVertexPositionBuffer);
        gl.vertexAttribPointer(vPos,2,gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if(key.SPACE)
        {
            this.endScene = true;
            key.SPACE = false;
        }
    }
    function glClear()
    {
        gl.clearColor(0.2, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    this.resetLvl = function()
    {
        label.title = endTitle;
        label.text = endText;
        panel.clear();
        label.draw();
        setShader(shader);
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
