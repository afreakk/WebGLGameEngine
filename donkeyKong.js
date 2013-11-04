function DKController(drawObjs,dkBuffer,shaderStruct,dkPosition,mass)
{
    var rigidBody=null;
    var vector = new Ammo.btVector3(0,0,0); // reuse of vector because of memory leak per new in ammo library
    var startY = dkPosition[1];
    var trans=null
    var startTransform = null;
    function init()
    {
        var dk = new gObject(drawObjs,dkBuffer,shaderStruct,dkPosition,10,"convex");
        rigidBody = dk.rigidBody;
        trans = dk.global;
        var flip = new Ammo.btQuaternion(0,1,0,0);
        var pos = new Ammo.btVector3(dkPosition[0],dkPosition[1],dkPosition[2]);
        startTransform = new Ammo.btTransform();
        startTransform.setRotation(flip);
        startTransform.setOrigin(pos);
        rigidBody.setCenterOfMassTransform(startTransform);
        vector.setZero();
        vector.setZ(1);
        rigidBody.setAngularFactor(vector);
    }
    this.reset = function()
    {
        rigidBody.setCenterOfMassTransform(startTransform);
        rigidBody.setLinearVelocity(new Ammo.btVector3(0,0,0));
        trans.setPosition(vec3.fromValues(0,0,0));
    }
    this.getPos=function()
    {
        return trans.getPos();
    }
    this.getBody=function()
    {
        return rigidBody;
    }
    var KMHspeed= 0.0;
    this.getSpeed=function()
    {
        return KMHspeed;
    }
    this.getZ=function()
    {
        var vec = trans.getPos();
        return vec[2];
    }
    this.update=function()
    {
        var speed = 100.0;
        vector.setZero();
        rigidBody.activate(true);
        if(trans.getPos()[1]<=startY)
        {
            var maxSpeed = 9.0;
            var velocity = rigidBody.getLinearVelocity();
            KMHspeed =velocity.getZ();
            if(key.SPACE)
                vector.setY(5000);
            if(key.Left&&velocity.getX()>-maxSpeed)
                vector.setX(-speed);
            if(key.Right&&velocity.getX()<maxSpeed)
                vector.setX(speed);
            if(key.Down&&velocity.getZ()<maxSpeed)
                vector.setZ(speed);
            if(key.Up&&velocity.getZ()>-maxSpeed)
                vector.setZ(-speed);
        }
        rigidBody.applyCentralForce(vector);
    }
    init();
}
