function Castle(objs,drawObjs,shaderStructX)
{
    var bricks = new Array();
    var shaderStruct = shaderStructX;
    var brickShape = null;
    var brickMass = 10;
    var buffer = objs['brick'].generateBuffers();

    var yElements = 10;
    var xElements = 10;
    var zElements = 10;
    var sX=1.3,sY=0.7,sZ=0.6;
    var xOff = sX*xElements/2.0;
    var yOff = 2.0; 
    var zOff = sZ*zElements/2.0;

    this.update=function(deltaTime)
    {
    }
    function makeShape(objs)
    {
        brickShape = new Ammo.btBoxShape(new Ammo.btVector3(sX/2.0,sY/2.0,sZ/2.0));
        var localInertia = new Ammo.btVector3(0, 0, 0);
        brickShape.calculateLocalInertia(brickMass, localInertia);
    }
    function initCastle(drawObjs,shaderStruct)
    {
        var i=0;
        for(var y=0; y<yElements; y++)
        {
            for(var x=0; x<xElements; x++)
            {
                for(var z=0; z<zElements; z++)
                {
                    if(x==0||x==xElements-1||z==0||z==zElements-1)
                    {
                        var pos = vec3.fromValues(x*sX-xOff,y*sY-yOff,z*sZ-zOff);
                        bricks[i] = new gObject(drawObjs,buffer,shaderStruct,pos,brickMass,brickShape);
                        bricks[i].rigidBody.setRestitution(0.0);
                        bricks[i].rigidBody.setFriction(1.0);
                        i++;
                    }
                }
            }
        }
        console.log(i+" cubes initialized");
    }
    function init()
    {
        makeShape(objs);
        initCastle(drawObjs,shaderStruct);
    }
    init();
}
