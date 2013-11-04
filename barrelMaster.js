
function BarrelMaster(meshBuffer,drawContainer,shaderStructX)
{
    var barrelBuffer=null;
    var drawObjs=null;
    var shaderStruct=null;
    var barrelOffset = mat4.create();
    mat4.translate(barrelOffset,barrelOffset,vec3.fromValues(0,-1.25,0));
    var barrelArray = [];
    var radius = 0.8;
    var height = 2.0;
    var mass = 20.0;
    var transform = new Ammo.btTransform();
    var quat = null;
    var force = 100.0;
    var forceVec = null;
    var relPos = null;
    var timeBetween = 2.0;
    var zValue = 0.0;
    this.setZ=function(value)
    {
        zValue= value;
    }
    this.reset=function()
    {
        while(barrelArray.length > 0)
        {
            barrelArray[barrelArray.length-1].dontRender();
            pWorld.removeBody(barrelArray[barrelArray.length-1].rigidBody);
            barrelArray.pop();
        }
    }
    this.decreaseTimeBetween= function()
    {
        timeBetween -= timeBetween/2.5;
    }
    function init(meshBuffer,drawContainer,shaderStructX)
    {
        barrelBuffer = meshBuffer;
        drawObjs = drawContainer;
        shaderStruct = shaderStructX;
        quat = new Ammo.btQuaternion(0.0, 0.0, Math.sqrt(0.5), Math.sqrt(0.5));
        forceVec = new Ammo.btVector3(0,0,force);
        relPos = new Ammo.btVector3(0,0.25,0);
    }
    function sendBarrel(barrelPos)
    {
        var tempBarrel = new gObject(drawObjs,barrelBuffer,shaderStruct,barrelPos, mass, "cylinder",radius,height);
        tempBarrel.setOffset(barrelOffset);
        transform = tempBarrel.rigidBody.getWorldTransform();
        transform.setRotation(quat);
        tempBarrel.rigidBody.setCenterOfMassTransform(transform);
        tempBarrel.rigidBody.applyImpulse(forceVec,relPos);
        tempBarrel.rigidBody.setFriction(1.0);
        barrelArray.push(tempBarrel);
    }
    var hasSent = false;
    this.update=function(time,dt)
    {
        var posSwitcher = Math.random()*16.0;
        var fromPos = vec3.fromValues(8.0-posSwitcher,2.5,zValue);
        if(time%timeBetween<0.1)
        {
            if(!hasSent)
            {
                sendBarrel(fromPos);
                hasSent = true;
            }
        }
        else
        {
            hasSent=false;
        }

    }
    init(meshBuffer,drawContainer,shaderStructX);
}
