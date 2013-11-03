function DKController(drawObjs,dkBuffer,shaderStruct,dkPosition,mass)
{
    var rigidBody=null;
    var vector = new Ammo.btVector3(0,0,0); // reuse of vector because of memory leak per new in ammo library
    var startY = dkPosition[1];
    var trans=null;
    function init()
    {
        var dk = new gObject(drawObjs,dkBuffer,shaderStruct,dkPosition,10,"convex");
        rigidBody = dk.rigidBody;
        trans = dk.global;
        var flip = new Ammo.btQuaternion(0,1,0,0);
        var pos = new Ammo.btVector3(dkPosition[0],dkPosition[1],dkPosition[2]);
        var transform = new Ammo.btTransform();
        transform.setRotation(flip);
        transform.setOrigin(pos);
        rigidBody.setCenterOfMassTransform(transform);
        vector.setZero();
        vector.setZ(1);
        rigidBody.setAngularFactor(vector);
    }
    this.getPos=function()
    {
        return trans.getPos();
    }
    this.update=function()
    {
        var speed = 100.0;
        vector.setZero();
        rigidBody.activate(true);
        if(key.SPACE&&trans.getPos()[1]<=startY)
            vector.setY(5000);
        if(key.Left)
            vector.setX(-speed);
        if(key.Right)
            vector.setX(speed);
        if(key.Down)
            vector.setZ(speed);
        if(key.Up)
            vector.setZ(-speed);
        rigidBody.applyCentralForce(vector);
    }
    init();
}
