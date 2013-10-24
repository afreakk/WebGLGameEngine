function CannonControl(drawObjs,objs,shaderStruct,Camera)
{
    var slowMo = false;
    var cDistance = 15.0;
    var cannon = null;
    var camera = Camera;
    var cannonBallShape = null;
    var cannonBalls = new Array();
    var buffer = null;
    var mass = 19;
    this.getSlow=function()
    {
        return slowMo;
    }
    function init(drawObjs,objs,shaderStruct)
    {
        var cannPos = vec3.fromValues(0,2,30);
        cannon = new gObject(drawObjs,objs['cannon'].generateBuffers(),shaderStruct,cannPos,5);
        initCannonBallShape(objs);
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
    }
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
    var btVel=new Ammo.btVector3(0,0,0);
    var bulletVel=new Ammo.btVector3(0,0,0);
    var turnTorq = new Ammo.btVector3(0,0,0);
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
    function steerCannon(vector,deltaTime)
    {
        var speed = deltaTime*5.0;
        btVel.setZero();
        turnTorq.setZero();
        if(key.Up)
            setVelNY(btVel,backwards,-speed);
        if(key.Down)
            setVelNY(btVel,backwards,speed);
        if(key.Left)
        {
            turnTorq.setY(speed*300.0);
        }
        else if(key.Right)
        {
            turnTorq.setY(-speed*300.0);
        }
        updateCannonPosition();
    }
    var bulCamLerp=0.0;
    function cameraLookAt(deltaTime)
    {
        if(key.Q)
            aCannonI=null;
        if(aCannonI!==null)
        {
            if(bulCamLerp<0.9)
                bulCamLerp += deltaTime/12.0;
            var lookFrom = vec3.create();
            var lerpFrom = vec3.create();
            vec3.add(lerpFrom,cannon.global.getPos(),vec3.fromValues(0,2,0));
            vec3.lerp(lookFrom,lerpFrom,cannonBalls[aCannonI].global.getPos(),bulCamLerp);
            camera.lookAtFrom(cannonBalls[aCannonI].global.getPos(),lookFrom);
            slowMo=true;
        }
        else
        {
            camera.lookAtFrom(cannon.global.getPos(),pos);
            slowMo=false;
        }
    }
    function updateCannonPosition()
    {
        cannon.rigidBody.activate();
        cannon.rigidBody.applyTorque(turnTorq);
        cannon.rigidBody.translate(btVel);
    }
    var cannonPos=0;
    var canShot = true;
    var pos=null;
    function updatePos(deltaTime)
    {
        var turnSpeed = deltaTime;
        pos = vec3.create();
        var backwardsXX = vec3.fromValues(backwards[0]*cDistance,backwards[1]+cDistance/2.0,backwards[2]*cDistance);
        vec3.add(pos, cannon.global.getPos(), backwardsXX);
    }
    var aCannonI=null;
    function shootCannonBalls()
    {
        if(key.SPACE&&canShot)
        {
            var xOffset = -0.40;
            var ln = 2.0;
            var cBPos = vec3.fromValues(cannon.global.getPos()[0],cannon.global.getPos()[1],cannon.global.getPos()[2]);
            vec3.add(cBPos,cBPos,vec3.fromValues(-backwards[0]*ln+xOffset,1.2,-backwards[2]*ln));
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
        }
        else if(!key.SPACE)
        {
            canShot = true;
        }
    }
    function updateCannonBalls()
    {
    }
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
