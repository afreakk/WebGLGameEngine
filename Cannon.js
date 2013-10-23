function CannonControl(drawObjs,objs,shaderStruct,Camera)
{
    var cDistance = 15.0;
    var cannon = null;
    var camera = Camera;
    var cannonBallShape = null;
    var cannonBalls = new Array();
    var buffer = null;
    var mass = 10;
    function init(drawObjs,objs,shaderStruct)
    {
        var cannPos = vec3.fromValues(0,10,15);
        cannon = new gObject(drawObjs,objs['cannon'].generateBuffers(),shaderStruct,cannPos,5);
        initCannonBallShape(objs);
    }
    this.update=function(vector,deltaTime) 
    {
        updatePos(deltaTime);
        steerCannon(vector,deltaTime);
        shootCannonBalls();
        updateCannonBalls();
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
    var turnTorq = new Ammo.btVector3(0,0,0);
    var backwards = vec3.fromValues(0,0,1);
    var up = vec3.fromValues(0,1,0);
    function steerCannon(vector,deltaTime)
    {
        var speed = deltaTime*5.0;
        var dir = cannon.global.getRot();
        backwards = vec3.fromValues(0,0,1);
        up = vec3.fromValues(0,1,0);
        vec3.transformQuat(up,up,dir); 
        vec3.transformQuat(backwards,backwards,dir);
        btVel.setZero();
        turnTorq.setZero();
        if(key.Up)
            setVel(btVel,backwards,-speed)
        if(key.Down)
            setVel(btVel,backwards,speed)
        if(key.Left)
        {
            turnTorq.setY(speed*300.0);
        }
        else if(key.Right)
        {
            turnTorq.setY(-speed*300.0);
        }
        camera.lookAtFrom(cannon.global.getPos(),pos);
        updateCannonPosition();
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
            var str = 500.1;
            var i = cannonBalls.length-1;
            var btbackwards = new Ammo.btVector3(-backwards[0]*str,-backwards[1]*str,-backwards[2]*str);
            cannonBalls[i].rigidBody.applyCentralImpulse(btbackwards);
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
    var Y = 0;
    var Z = dir[2];
    vel.setX(X*speed);
    vel.setY(Y*speed);
    vel.setZ(Z*speed);
}
