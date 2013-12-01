function CannonControl(drawObjs,objs,shaderStruct,Camera,panel,castleZposition)
{
    var castleZ = castleZposition;
    var cannon = null;
    var camera = Camera;
    var cannonBallShape = null;
    var cannonBalls = new Array();
    var buffer = null;
    var mass = 1.0;
    var labelKMH = null;
    var labelShotInfo = null;
    var labelRolls = null;
    var stringNormal = "Normal Time";
    var stringShotInfo = "";
    var kmhString = "0";
    var stringSlowMotion = "Slow Motion";
    var currentModeString = "";
    var rollsString = 2;
    var str = 30.0;
    var wall = null;
    var xCamDistance = 15.0;
    var yCamDistance = 8.4;
    var zCamDistance = 15.0;
    var explosion = null;
    var mode = "aimingMode";
    var rollCount = 0;
    function initGUI(panel)
    {
        labelKMH = new multicrew.Label({ title: "KM/H: ", text: kmhString, x: this.canvas.width-this.canvas.width/8, y: this.canvas.height/8.0,
        color: "#FFF", titleColor: "#ffff00" });
        labelShotInfo = new multicrew.Label({ title: stringShotInfo, text: " ", x: this.canvas.width/2.0, y: this.canvas.height/2.0,
        color: "#FFF", titleColor: "#ffff00" });
        labelRolls = new multicrew.Label({ title: "(h to toggle instructions) Rolls left:", text: rollsString, x: this.canvas.width/2.0, y: this.canvas.height-this.canvas.height/16.0,
        color: "#FFF", titleColor: "#ffff00" });
        panel.insert(labelRolls);
        panel.insert(labelKMH);
        panel.insert(labelShotInfo);
    }
    function updateGUI()
    {
        if(mode === "bulletTimeMode"){
            currentModeString = stringSlowMotion;
            kmhString = Math.abs( (cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getZ()
            +cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getX()
            +cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getZ()).toFixed(2) );
        }
        else{
            currentModeString = stringNormal;
        }
        labelRolls.text = rollsString;
        labelShotInfo.title = stringShotInfo;
        labelKMH.text = kmhString;
    }
    function init(drawObjs,objs,shaderStruct)
    {
        var cannPos = vec3.fromValues(0,-10.5,180.5);
        var wallPos = vec3.fromValues(0,-11.3,180);
        cannon = new rObject(drawObjs,objs['cannon'].generateBuffers(),shaderStruct,cannPos);
        wall = new rObject(drawObjs,objs['wall'].generateBuffers(),shaderStruct,wallPos);
        var pOffset= vec3.fromValues(0.40,0.0,0.0);
        cannon.global.setPosOffset(pOffset);
        initCannonBallShape(objs);
        explosion = new Explosion(drawObjs,objs['particle'].generateBuffers(),shaderStruct,vec3.fromValues(0,-9.5,178),3,vec3.fromValues(0.1,0.1,0.1));
    }
    this.setCanShoot = function(canIt)
    {
        parentAllowsShooting = canIt;
    }
    this.update=function(vector,deltaTime,castleHit) 
    {
        getDirections();
        cameraLookAt(deltaTime,castleHit);
        if(mode === "aimingMode") 
        {
            steerCannon(vector,deltaTime);
            removeCannonBalls();
        }
        else if(mode === "bulletTimeMode") 
            steerBullet(deltaTime);
        updateGUI();
        explosion.update(camera.getPos(),deltaTime);
    }
    var bulletVel = new Ammo.btVector3(0,0,0);
    function steerBullet(deltaTime)
    {
        var force = 100;
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
    this.getBulletPos=function()
    {
        if(mode === "bulletTimeMode")
            return cannonBalls[aCannonI].global.getPos();
        else
        {
            var canPos = cannon.global.getPos();
            return vec3.fromValues(canPos[0],10,canPos[2]);
        }
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
        var radius = 0.7;
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
    var wobblyPins = false;
    this.setWobblyPins=function(inWobbly)
    {
        wobblyPins = inWobbly;
        if(wobblyPins===true)
        {
            wobblyTimeOut= 0.0;
        }
    }
    function steerCannon(vector,deltaTime)
    {
        yAngle = 0.0;
        var speed = deltaTime*0.5;
        aLock = Math.PI/6.0;
        if(key.Left&&yTotal<aLock)
            yAngle += speed;
        else if(key.Right&&yTotal>-aLock)
            yAngle -= speed;
        yTotal += yAngle;
        /*xAngle = 0.0;
        else if(key.Up&&xTotal<aLock)
            xAngle += speed;
        else if(key.Down&&xTotal>0)
            xAngle -= speed;
        xTotal += xAngle;*/
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
    function cameraLookAt(deltaTime,castleHit)
    {
        switch (mode)
        {
            case "bulletTimeMode": mode = bulletTimeMode(deltaTime,castleHit); return;
            case "birdPerspectiveMode":mode = birdPerspectiveMode(deltaTime); return;
            case "aimingMode": mode = aimingMode(deltaTime); return;
            default: alert("mode undefined(Cannon.js)!"); return;
        }
    }
    this.getMode = function()
    {
        return mode;
    }
    var typeShotString=" ";
    this.setTypeShotString = function(inShot)
    {
        typeShotString = inShot;
    }
    var minTimeInBirdPerspective= 4.0;
    var timeInBirdPerspective = 0.0;
    function birdPerspectiveMode(deltaTime)
    {
        timeInBirdPerspective += deltaTime;
        stringShotInfo = typeShotString;
        camera.lookAtFrom(vec3.fromValues(0,-12.5,castleZ-12.5),vec3.fromValues(7.5,-7.5,castleZ-4)); 
        if(timeInBirdPerspective> minTimeInBirdPerspective&&!wobblyPins)
        {
            timeInBirdPerspective = 0;
            return "aimingMode";
        }
        return "birdPerspectiveMode";
    }
    function aimingMode(deltaTime)
    {
        camera.lookAtFrom(cannon.global.getPos(),getAimingModePos());
        return shootCannonBalls(deltaTime);
    }
    function bulletTimeMode(deltaTime,castleHit)
    {
        if(bulCamLerp<0.9)
            bulCamLerp += deltaTime/5.0;
        var lookFrom = vec3.create();
        var lerpFrom = vec3.create();
        vec3.add(lerpFrom,cannon.global.getPos(),vec3.fromValues(backwards[0]*xCamDistance,yCamDistance*4.0,backwards[2]*zCamDistance));

        vec3.lerp(lookFrom,lerpFrom,cannonBalls[aCannonI].global.getPos(),bulCamLerp);
        camera.lookAtFrom(cannonBalls[aCannonI].global.getPos(),lookFrom);

        if(castleHit)
        {
            aCannonI = null;
            rollsString -=1;
            return "birdPerspectiveMode";
        }
        else if(cannonBalls[aCannonI].global.getPos()[2] < castleZ-10)
        {
            aCannonI = null;
            rollsString -=1;
            return "birdPerspectiveMode";
        }
        return "bulletTimeMode";
    }
    this.setRollsLeft = function(rolls)
    {
        rollsString = rolls;
    }
    this.getRollsLeft=function()
    {
        return rollsString;
    }
    this.isBirdPerspective=function()
    {
        if(mode === "birdPerspectiveMode")
            return true;
        else
            return false;
    }
    var cannonPos=0;
    var parentAllowsShooting=false;
    function getAimingModePos()
    {
        var backwardsXX = vec3.fromValues(backwards[0]*xCamDistance,backwards[1]+yCamDistance,backwards[2]*zCamDistance);
        return vec3.add(vec3.create(), cannon.global.getPos(), backwardsXX);
    }
    var aCannonI=null;
    var wobblyTimeOut = 0;
    function shootCannonBalls(dt)
    {
        wobblyTimeOut += dt;
        if(parentAllowsShooting)
        {
            if(wobblyTimeOut>0.5)
            {
                stringShotInfo = "";
                if(key.SPACE)
                {
                    audioMgr.playSequential("cannon.ogg");
                    var ln = 5.0;
                    var cBPos = vec3.fromValues(cannon.global.getPos()[0],cannon.global.getPos()[1],cannon.global.getPos()[2]);
                    vec3.add(cBPos,cBPos,vec3.fromValues(-backwards[0]*ln,3.0,-backwards[2]*ln));
                    cannonBalls.push(new gObject(drawObjs,buffer,shaderStruct,cBPos,mass,cannonBallShape));
                    var i = cannonBalls.length-1;
                    var btbackwards = new Ammo.btVector3(-backwards[0]*str,-backwards[1]*str,-backwards[2]*str);
                    cannonBalls[i].rigidBody.applyCentralImpulse(btbackwards);
                    cannonBalls[i].rigidBody.setRestitution(0.1);
                    cannonBalls[i].rigidBody.setFriction(0.1);
                    aCannonI= i;
                    bulCamLerp=0.0;
                    explosion.setCenter(cannonBalls[i].global.getPos());
                    explosion.wake();
                    rollCount++;
                    return  "bulletTimeMode";
                }
            }
            else
                stringShotInfo = "Please wait, a pin is wobbling..";
        }
        else
            stringShotInfo = "Please wait, for machine..";
        return "aimingMode";
    }
    this.getRollCount=function()
    {
        return rollCount;
    }
    function removeCannonBalls()
    {
        for(var i=0; i<cannonBalls.length; i++)
        {
            if( i != aCannonI ) 
            {
                if(cannonBalls[i] !== null)
                {
                    cannonBalls[i].remove()
                    cannonBalls[i] = null;
                }
            }
        }
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
