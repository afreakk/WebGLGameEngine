function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;           //public variables to show when and what nextlvl is
    this.canvas=null;        //size and stuff set each frame by resizeHandling

    var shaderStruct=null; //shaderstruct to keep the shader variable and all the attributes and uniform variables
    var guiShader = null;
    var deltaTime=0;
    var lastTime=0;
    var time=0;
    var light=null;
    var dirLight = null;
    var camera0=null;
    var drawObjs = new DrawableObjects();
    var objs = Objs;
    var groundPlane= null;
    var startTime = new Date().getTime();
    var cannon = null;
    var castle = null;
    var panel= null;
    this.GLSettings= function()   //being run automatically by sceneManager
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        var guiShader = getShader(gl,"vs/guiShader","fs/guiShader");
        shaderStruct = new getShaderStruct(shader);
        setShader(shaderStruct.shader);
        gl.uniform1f(shaderStruct.alpha, 1.0 );
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex,shaderStruct.diffColor, 
        shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable (gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    var guiPlane = null;
    function initGroundPlane()
    {
        var pos = vec3.fromValues(0,-4,0);
        groundPlane = new gObject(drawObjs,objs['ground'].generateBuffers(),shaderStruct,pos,0,"triMesh");
        groundPlane.rigidBody.setFriction(10.0);
    }
    this.init = function()      // this function gets run automatically by scenemanager each time the scene gets "loaded"
    {
        panel = new multicrew.Panel("panel");
        pWorld = new PhysicsWorld();
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        camera0 = new Camera(drawObjs, cPos0,cLookAt,shaderStruct,  45.0,   0.1,  300.0,this.canvas,1.0,1.0,0.0,0.0);
//        debugDraw = new DebugDraw(drawObjs,new ObligTerning(1.0),shaderStruct,vec3.fromValues(0.0, 10.0, -5.0, 137)); //global object without physics
        var lightColor = vec3.fromValues(1.0,0.95,0.9);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 50.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,2.5);
        console.log("sceneOne initiated");
        initGroundPlane();
        var pinDistance = 150;
        cannon = new CannonControl(drawObjs,objs,shaderStruct,camera0,panel,pinDistance);
        castle = new Castle(objs,drawObjs,shaderStruct, panel,pinDistance);
        guiPlane = new gui3DElement(drawObjs,objs['plane'].generateBuffers(),shaderStruct,helpTipStartPos);
        guiUpd(0);
    }   
    var helpTipStartPos = vec3.fromValues(0,-6,175);
    var toggleHelp = true;
    var hKeyTimer = 0;
    function guiUpd(dt)
    {
        if(toggleHelp)
            visual();
        hKeyTimer += dt;
        if(key.H===true&&hKeyTimer>0.5)
        {
            hKeyTimer = 0;
            toggleHelp = !toggleHelp;
        }
        if(toggleHelp=== true)
            guiPlane.setHidden(false);
        else if (toggleHelp === false)
            guiPlane.setHidden(true);
    }
    function visual()
    {
        if(cannon.getMode() === "aimingMode")
        {
            if(guiPlane.getCurrentTexture() !== "howToMove.png")
                guiPlane.useTexture('howToMove.png');
            guiPlane.global.setPosition(helpTipStartPos);
        }
        if(cannon.getMode() === "bulletTimeMode")
        {
            if(guiPlane.getCurrentTexture() !== "manipulatePhys.png")
                guiPlane.useTexture('manipulatePhys.png');
            guiPlane.global.setPosition([cannon.getBulletPos()[0],cannon.getBulletPos()[1]+1,cannon.getBulletPos()[2]+2]);
        }
        if(cannon.getMode() === "birdPerspectiveMode")
        {
            if(guiPlane.getCurrentTexture() === "manipulatePhys.png")
            {
                toggleHelp = false;
                guiPlane.setHidden(true);
            }
        }
    }
    this.update = function()
    {
        var lDistance = 20.0;
        if(cannon.getBulletPos() !== null)
        {
            light.setPosition(cannon.getBulletPos()[0],cannon.getBulletPos()[1],cannon.getBulletPos()[2]);
        }
        glClear(); //clears the screen
        handleTime();
        guiUpd(deltaTime);
        castle.setRollCount(cannon.getRollCount());
        castle.update(deltaTime);
        cannon.setTypeShotString(castle.getTypeShotStr());
        cannon.setCanShoot(castle.isAllowedToShoot());
        cannon.setWobblyPins(castle.getWobbling());
        cannon.update(vec3.fromValues(0.0, 0.0, 0.0),deltaTime,castle.getBrickHit());
        if((!cannon.getRollsLeft()||castle.getTypeShotStr()==="Strike!"||castle.getTypeShotStr()==="Spare!")&&cannon.getMode() == "aimingMode")
        {
            castle.reset();
            cannon.setRollsLeft(2);
        }
        castle.setBrickhit(cannon.isBirdPerspective());
        generalUpdate();//
        camera0.update(); //needs to be called each update for each camera
        camera0.draw();
    }
    function generalUpdate()
    {
        panel.clear()
        panel.draw()
        if(cannon.getMode()=== "bulletTimeMode")
            pWorld.update(1/60,5.0); //and this
        else
            pWorld.update(1/60,false);
        doc.title = "FPS: "+Math.round(1.0/deltaTime);
    }
    function handleTime()
    {
        var now = new Date().getTime()-startTime;
        deltaTime = (now - lastTime)/1000;
        time += deltaTime;
        lastTime = now;
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
    this.nextLvl=1;           //public variables to show when and what nextlvl is
    this.canvas=null;        //size and stuff set each frame by resizeHandling
    var panel= null;
    this.init = function()
    {
    }
    this.GLSettings = function()
    {
    }
    this.update = function()
    {
        this.endScene = true;
    }
}
