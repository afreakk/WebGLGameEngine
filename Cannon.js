function CannonControl(drawObjs,objs,shaderStruct,Camera,panel,castleZposition)
{
    var castleZ = castleZposition;
    var slowMo = false;
    var cannon = null;
    var camera = Camera;
    var cannonBallShape = null;
    var cannonBalls = new Array();
    var buffer = null;
    var mass = 1.0;
    var labelMode = null;
    var labelKMH = null;
    var labelShotInfo = null;
    var labelRolls = null;
    var stringNormal = "Normal Time";
    var stringShotInfo = "";
    var kmhString = "0";
    var stringSlowMotion = "Slow Motion";
    var currentModeString = "";
    var rollsString = 2;
    var typeShotString = "";
    var str = 20.1;
    var wall = null;
    var xCamDistance = 6.0;
    var yCamDistance = 1.4;
    var zCamDistance = 6.0;
    var explosion = null;
    function initGUI(panel)
    {
        labelMode = new multicrew.Label({ title: "MODE: ", text: currentModeString, x: this.canvas.width/8, y: this.canvas.height-this.canvas.height/8.0, 
        color: "#FFF", titleColor: "#ffff00" });
        labelKMH = new multicrew.Label({ title: "KM/H: ", text: kmhString, x: this.canvas.width-this.canvas.width/8, y: this.canvas.height/8.0,
        color: "#FFF", titleColor: "#ffff00" });
        labelShotInfo = new multicrew.Label({ title: stringShotInfo, text: " ", x: this.canvas.width/2.0, y: this.canvas.height/8.0,
        color: "#FFF", titleColor: "#ffff00" });
        labelRolls = new multicrew.Label({ title: "Rolls left:", text: rollsString, x: this.canvas.width/2.0, y: this.canvas.height-this.canvas.height/8.0,
        color: "#FFF", titleColor: "#ffff00" });
        panel.insert(labelRolls);
        panel.insert(labelMode);
        panel.insert(labelKMH);
        panel.insert(labelShotInfo);
    }
    function updateGUI()
    {
        if(cannonBalls.length>0)
            kmhString = Math.abs( (cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getZ()
            +cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getX()
            +cannonBalls[cannonBalls.length-1].rigidBody.getLinearVelocity().getZ()).toFixed(2) );
        if(slowMo){
            currentModeString = stringSlowMotion;
        }
        else{
            currentModeString = stringNormal;
        }
        labelRolls.text = rollsString;
        labelShotInfo.title = stringShotInfo;
        labelKMH.text = kmhString;
        labelMode.text = currentModeString;
    }
    this.getSlow=function()
    {
        return slowMo;
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
    this.update=function(vector,deltaTime,castleHit) 
    {
        if(castleHit)
        {
            aCannonI=null;
            slowMo = false;
        }
        getDirections();
        updatePos(deltaTime);
        cameraLookAt(deltaTime,castleHit);
        shootCannonBalls(castleHit);
        updateCannonBalls();
        if(!slowMo) {
            steerCannon(vector,deltaTime);
        }
        else {
            steerBullet(deltaTime);
        }
        updateGUI();
        explosion.update(camera.getPos(),deltaTime);
    }
    bulletVel = new Ammo.btVector3(0,0,0);
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
        if(aCannonI!= null)
            return cannonBalls[aCannonI].global.getPos();
        else
            return null;
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
    this.getSlow= function()
    {
        return slowMo;
    }
    function cameraLookAt(deltaTime,castleHit)
    {
        if(aCannonI!==null)
            mode = "bulletTimeMode";
        else if((castleHit&&timeInBirdPerspective<4.0) )
            mode = "birdPerspectiveMode";
        else
            mode = "aimingMode";
        if (timeInBirdPerspective>4.0 && castleHit == false)
        {
            timeInBirdPerspective = 0;
        }
        switch (mode)
        {
            case "bulletTimeMode": bulletTimeMode(deltaTime); break;
            case "birdPerspectiveMode": birdPerspectiveMode(deltaTime); break;
            case "aimingMode": aimingMode(deltaTime); break;
        }
    }
    this.getMode = function()
    {
        return mode;
    }

    function birdPerspectiveMode(deltaTime)
    {
        stringShotInfo = typeShotString;
        timeInBirdPerspective+= deltaTime;
        camera.lookAtFrom(vec3.fromValues(0,-12.5,castleZ-12.5),vec3.fromValues(7.5,-7.5,castleZ-4)); 
        isBirdPerspective = true;
    }
    function aimingMode(deltaTime)
    {
        stringShotInfo = "";
        camera.lookAtFrom(cannon.global.getPos(),pos);
        isBirdPerspective = false;
    }
    function bulletTimeMode(deltaTime)
    {
        if(bulCamLerp<0.9)
            bulCamLerp += deltaTime/10.0;
        var lookFrom = vec3.create();
        var lerpFrom = vec3.create();
        vec3.add(lerpFrom,cannon.global.getPos(),vec3.fromValues(xCamDistance,yCamDistance,zCamDistance));

        vec3.lerp(lookFrom,lerpFrom,cannonBalls[aCannonI].global.getPos(),bulCamLerp);
        camera.lookAtFrom(cannonBalls[aCannonI].global.getPos(),lookFrom);

        if(slowMo == false)
            rollsString -=1;
        slowMo = true;
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
        return isBirdPerspective;
    }
    var isBirdPerspective;
    var timeInBirdPerspective = 0;
    var cannonPos=0;
    var canShot = false;
    var pos=null;
    function updatePos(deltaTime)
    {
        var turnSpeed = deltaTime;
        pos = vec3.create();
        var backwardsXX = vec3.fromValues(backwards[0]*xCamDistance,backwards[1]+yCamDistance,backwards[2]*zCamDistance);
        vec3.add(pos, cannon.global.getPos(), backwardsXX);
    }
    var aCannonI=null;
    function shootCannonBalls(castleHit)
    {
        if(key.SPACE&&canShot)
        {
            var ln = 2.0;
            var cBPos = vec3.fromValues(cannon.global.getPos()[0],cannon.global.getPos()[1],cannon.global.getPos()[2]);
            vec3.add(cBPos,cBPos,vec3.fromValues(-backwards[0]*ln,1.2,-backwards[2]*ln));
            cannonBalls.push(new gObject(drawObjs,buffer,shaderStruct,cBPos,mass,cannonBallShape));
            canShot = false;
            var i = cannonBalls.length-1;
            var btbackwards = new Ammo.btVector3(-backwards[0]*str,-backwards[1]*str,-backwards[2]*str);
            cannonBalls[i].rigidBody.applyCentralImpulse(btbackwards);
            cannonBalls[i].rigidBody.setRestitution(0.1);
            cannonBalls[i].rigidBody.setFriction(0.1);
            aCannonI= i;
            bulCamLerp=0.0;
            explosion.setCenter(cannonBalls[i].global.getPos());
            explosion.wake();
        }
        else if(timeInBirdPerspective> 4.0)
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
