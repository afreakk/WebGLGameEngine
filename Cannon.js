function CannonControl(drawObjs,objs,shaderStruct,Camera,panel)
{
    var slowMo = false;
    var cannon = null;
    var camera = Camera;
    var cannonBallShape = null;
    var cannonBalls = new Array();
    var buffer = null;
    var mass = 19;
    var labelMode = null;
    var stringNormal = "Normal Time";
    var stringSlowMotion = "Slow Motion";
    var currentModeString = "";

    var xCamDistance = 6.0;
    var yCamDistance = 1.4;
    var zCamDistance = 6.0;
    var explosion = null;
    function initGUI(panel)
    {
        labelMode = new multicrew.Label({ title: "MODE: ", text: currentModeString, x: this.canvas.width/8, y: this.canvas.height-this.canvas.height/8.0, 
        color: "#FFF", titleColor: "#ffff00" })
        panel.insert(labelMode);
    }
    function updateGUI()
    {
        if(slowMo){
            currentModeString = stringSlowMotion;
        }
        else{
            currentModeString = stringNormal;
        }
        labelMode.text = currentModeString;
    }
    this.getSlow=function()
    {
        return slowMo;
    }
    function init(drawObjs,objs,shaderStruct)
    {
        var cannPos = vec3.fromValues(0,-11,180);
        cannon = new rObject(drawObjs,objs['cannon'].generateBuffers(),shaderStruct,cannPos);
        var pOffset= vec3.fromValues(0.40,0.0,0.0);
        cannon.global.setPosOffset(pOffset);
        initCannonBallShape(objs);
        explosion = new Explosion(drawObjs,objs['particle'].generateBuffers(),shaderStruct,vec3.fromValues(0,-9.5,178),2,vec3.fromValues(0.1,0.1,0.1));
    }
    this.update=function(vector,deltaTime) 
    {
        getDirections();
        updatePos(deltaTime);
        cameraLookAt(deltaTime);
        shootCannonBalls();
        updateCannonBalls();
        if(!slowMo)
            steerCannon(vector,deltaTime);
        else
            steerBullet(deltaTime);

        updateGUI();
        explosion.update(camera.getPos(),deltaTime);
    }
    bulletVel = new Ammo.btVector3(0,0,0);
    function steerBullet(deltaTime)
    {
        var force = 10000;
        bulletVel.setZero();
        if(key.Up)
            setVel(bulletVel,up,force);
        if(key.Down)
            setVel(bulletVel,up,-force);
        if(key.Left)
            setVel(bulletVel,right,-force);
        if(key.Right)
            setVel(bulletVel,right,force);
        updateBulletPos();
    }
    function updateBulletPos()
    {
        cannonBalls[aCannonI].rigidBody.activate();
        cannonBalls[aCannonI].rigidBody.applyCentralForce(bulletVel);
    }
    function initCannonBallShape(objs)
    {
        buffer = objs['cannonBall'].generateBuffers();
        var localInertia = new Ammo.btVector3(0,0,0);
        var radius = 0.5;
        cannonBallShape = new Ammo.btSphereShape(radius);
        cannonBallShape.calculateLocalInertia(mass, localInertia);
    }
    var backwards = vec3.fromValues(0,0,1);
    var up = vec3.fromValues(0,1,0);
    var right = vec3.fromValues(1,0,0);
    function getDirections()
    {
        var dir = cannon.global.getRot();
        backwards = vec3.fromValues(0,0,1);
        up = vec3.fromValues(0,1,0);
        right = vec3.fromValues(1,0,0);
        vec3.transformQuat(up,up,dir); 
        vec3.transformQuat(backwards,backwards,dir);
        vec3.transformQuat(right,right,dir);
    }
    var yAngle = 0.0;
    var xAngle = 0.0;
    var yTotal = 0.0;
    var xTotal = 0.0;
    function steerCannon(vector,deltaTime)
    {
        xAngle = 0.0;
        yAngle = 0.0;
        var speed = deltaTime*0.5;
        aLock = Math.PI/6.0;
        if(key.Left&&yTotal<aLock)
            yAngle += speed;
        else if(key.Right&&yTotal>-aLock)
            yAngle -= speed;
        /*else if(key.Up&&xTotal<aLock)
            xAngle += speed;
        else if(key.Down&&xTotal>0)
            xAngle -= speed;*/
        xTotal += xAngle;
        yTotal += yAngle;
        updateCannonPosition();
    }
    function updateCannonPosition()
    {
        var rotateY = quat.create();
        var rotateX = quat.create();
        quat.setAxisAngle(rotateY,vec3.fromValues(0.0,1.0,0.0),yAngle);
        quat.setAxisAngle(rotateX,vec3.fromValues(1.0,0.0,0.0),xAngle);
        cannon.global.rotate(rotateY);
        cannon.global.rotate(rotateX);
    }
    var bulCamLerp=0.0;
    function cameraLookAt(deltaTime)
    {
        if(key.Q)
        {
            aCannonI=null;
            slowMo = false;
        }
        if(key.E)
        {
            slowMo = true;
        }
        if(aCannonI!==null)
        {
            if(bulCamLerp<0.9)
                bulCamLerp += deltaTime/4.0;
            var lookFrom = vec3.create();
            var lerpFrom = vec3.create();
            vec3.add(lerpFrom,cannon.global.getPos(),vec3.fromValues(xCamDistance,yCamDistance,zCamDistance));

            vec3.lerp(lookFrom,lerpFrom,cannonBalls[aCannonI].global.getPos(),bulCamLerp);
            camera.lookAtFrom(cannonBalls[aCannonI].global.getPos(),lookFrom);
        }
        else
        {
            camera.lookAtFrom(cannon.global.getPos(),pos);
        }
    }
    var cannonPos=0;
    var canShot = true;
    var pos=null;
    function updatePos(deltaTime)
    {
        var turnSpeed = deltaTime;
        pos = vec3.create();
        var backwardsXX = vec3.fromValues(backwards[0]*xCamDistance,backwards[1]+yCamDistance,backwards[2]*zCamDistance);
        vec3.add(pos, cannon.global.getPos(), backwardsXX);
    }
    var aCannonI=null;
    function shootCannonBalls()
    {
        if(key.SPACE&&canShot)
        {
            var ln = 2.0;
            var cBPos = vec3.fromValues(cannon.global.getPos()[0],cannon.global.getPos()[1],cannon.global.getPos()[2]);
            vec3.add(cBPos,cBPos,vec3.fromValues(-backwards[0]*ln,1.2,-backwards[2]*ln));
            cannonBalls.push(new gObject(drawObjs,buffer,shaderStruct,cBPos,mass,cannonBallShape));
            canShot = false;
            var str = 1300.1;
            var i = cannonBalls.length-1;
            var btbackwards = new Ammo.btVector3(-backwards[0]*str,-backwards[1]*str,-backwards[2]*str);
            cannonBalls[i].rigidBody.applyCentralImpulse(btbackwards);
            cannonBalls[i].rigidBody.setRestitution(0.1);
            cannonBalls[i].rigidBody.setFriction(0.1);
            aCannonI= i;
            bulCamLerp=0.0;
            explosion.wake();
        }
        else if(!key.SPACE)
        {
            canShot = true;
        }
    }
    function updateCannonBalls()
    {
    }
    initGUI(panel);
    init(drawObjs,objs,shaderStruct);
}
function setVel(vel,dir,speed)
{
    var X = dir[0];
    var Y = dir[1];
    var Z = dir[2];
    vel.setX(X*speed);
    vel.setY(Y*speed);
    vel.setZ(Z*speed);
}
function setVelNY(vel,dir,speed)
{
    var X = dir[0];
    var Y = 0;
    var Z = dir[2];
    vel.setX(X*speed);
    vel.setY(Y*speed);
    vel.setZ(Z*speed);
}
