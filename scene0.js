function SceneOne(Objs)
{
    this.endScene=false;
    this.nextLvl=1;           //public variables to show when and what nextlvl is
    this.canvas=null;        //size and stuff set each frame by resizeHandling

    var shaderStruct=null; //shaderstruct to keep the shader variable and all the attributes and uniform variables
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
        var lightColor = vec3.fromValues(1.0,1.0,1.0);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 50.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,2.5);
        console.log("sceneOne initiated");
        initGroundPlane();
        cannon = new CannonControl(drawObjs,objs,shaderStruct,camera0,panel,170);
        castle = new Castle(objs,drawObjs,shaderStruct, panel,170);
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
        castle.update(deltaTime);
        cannon.update(vec3.fromValues(0.0, 0.0, 0.0),deltaTime,castle.getBrickHit());
        castle.setBrickhit(cannon.getTimeInBirdPerspective());
        generalUpdate();//
        camera0.update(); //needs to be called each update for each camera
        camera0.draw();
    }
    function generalUpdate()
    {
        panel.clear()
        panel.draw()
        if(cannon.getSlow()==true)
        {
            pWorld.update(deltaTime,10.0); //and this
        }
        else
        {
            pWorld.update(deltaTime,false);
        }
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
    this.nextLvl=0;
    this.init = function()
    {
        alert("SceneTwo not implemented");
    }
    this.update = function()
    {
    }
}
