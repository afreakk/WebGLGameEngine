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
    var bricks = new Array();
    var groundPlane= null;
    var cannon = null;
    var startTime = new Date().getTime();
    this.GLSettings= function()   //being run automatically by sceneManager
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        shaderStruct = new getShaderStruct(shader);
        setShader(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex,shaderStruct.diffColor, 
        shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }
    function initGroundPlane()
    {
        var pos = vec3.fromValues(0,-4,0);
        groundPlane = new gObject(drawObjs,objs['plane'].generateBuffers(),shaderStruct,pos,0);
        var cannPos = vec3.fromValues(0,10,15);
        cannon = new gObject(drawObjs,objs['cannon'].generateBuffers(),shaderStruct,cannPos,10);
    }
    function initCastle()
    {
        var yElements = 5;
        var xElements = 10;
        var zElements = 10;
        var mass = 1;
        var buffers = objs['brick'].generateBuffers();
        var shape = new Ammo.btConvexHullShape();
        var vec = new Ammo.btVector3();
        var points = buffers.vertexPoints;
        for(var i=0; i<points.length; i+=3)
        {
            vec.setX(points[i]);
            vec.setY(points[i+1]);
            vec.setZ(points[i+2]);
            shape.addPoint( vec  );
        }
        var localInertia = new Ammo.btVector3(0, 0, 0);
        shape.calculateLocalInertia(mass, localInertia);
        var i=0;
        var sX=1.3,sY=2.0,sZ=0.68;
        var xOff = sX*xElements/2.0;
        var yOff = 0.0; 
        var zOff = sZ*zElements/2.0;
        for(var y=0; y<yElements; y++)
        {
            for(var x=0; x<xElements; x++)
            {
                for(var z=0; z<zElements; z++)
                {
                    if(x==0||x==xElements-1||z==0||z==zElements-1)
                    {
                        var pos = vec3.fromValues(x*sX-xOff,y*sY-yOff,z*sZ-zOff);
                        bricks[i] = new gObject(drawObjs,buffers,shaderStruct,pos,mass,shape);
                        i++;
                    }
                }
            }
        }
        console.log(i+"cubes initialized");
    }
    this.init = function()      // this function gets run automatically by scenemanager each time the scene gets "loaded"
    {
        pWorld = new PhysicsWorld();
        var cPos0    = vec3.fromValues(5.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-5.0);
        camera0 = new Camera(drawObjs, cPos0,cLookAt,shaderStruct,  45.0,   0.1,  300.0,this.canvas,1.0,1.0,0.0,0.0);
        debugDraw = new DebugDraw(drawObjs,new ObligTerning(1.0),shaderStruct,vec3.fromValues(0.0, 10.0, -5.0, 137)); //global object without physics
        var lightColor = vec3.fromValues(1.0,1.0,1.0);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 1000.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,0.1);
        console.log("sceneOne initiated");
        initCastle();
        initGroundPlane();
    }                                  
    this.update = function()
    {
        var lDistance = 10.0;
        light.setPosition(Math.sin(time)*lDistance, 0.0, Math.cos(time)*lDistance);
        glClear(); //clears the screen
        generalUpdate();//
        lookAt(vec3.fromValues(0.0,-2.0,0.0));
        camera0.update(); //needs to be called each update for each camera
        camera0.draw();
    }
    function shootCannonBalls()
    {
    }
    function generalUpdate()
    {
        var now = new Date().getTime()-startTime;
        deltaTime = (now - lastTime)/1000;
        time += deltaTime;
        lastTime = now;
        pWorld.update(deltaTime); //and this
    }
    var cPos=vec3.fromValues(0,0,0);
    function lookAt(vector) 
    {
        var speed = deltaTime;
        var cDistance = 10.0;
        if(key.Up)
            cPos[1]+= speed;
        if(key.Down)
            cPos[1]-= speed;
        if(key.Left)
            cPos[0] -= speed;
        if(key.Right)
            cPos[0] += speed;
        var uPos=vec3.fromValues(Math.sin(cPos[0])*cDistance,cPos[1],Math.cos(cPos[0])*cDistance);
        vec3.add(uPos,uPos,vector);
        var cLook = vector;
        camera0.lookAtFrom(cLook,uPos);
       /* var speed = 15.1;
        var rotAmntP = quat.create();
        var rotAmntM = quat.create();
        var axis = vec3.fromValues(0,1,0);
        quat.setAxisAngle(rotAmntP,axis,toRad(1.0));
        quat.setAxisAngle(rotAmntM,axis,toRad(-1.0));
        model.rigidBody.activate();
        
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
            model.global.rotate(rotAmntM);*/

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
