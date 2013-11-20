function Castle(objs,drawObjs,shaderStructX,panel)
{
    var active = false;

    var bricks = new Array();
    var shaderStruct = shaderStructX;
    var brickShape = null;
    var brickMass = 0.1;
    var buffer = objs['brick'].generateBuffers();

    var yElements = 10;
    var xElements = 12;
    var zElements = 5;
    var sX=1.3/2,sY=0.7/2,sZ=0.6/2;
    var xOff = sX*xElements/2.0;
    var yOff = 2.0; 
    var zOff = sZ*zElements/2.0+10.0;
    var bricksFallen = 0; 
    var labelScore = null;
    var time = 0;
    this.update=function(deltaTime,cannonSlow)
    {
        time += deltaTime;
        if(!findOnce&&time>8.0)
        {
            findNormalPos();
            findOnce= true;
        }
        updateGUI();
    }
    function makeShape(objs)
    {
        brickShape = new Ammo.btBoxShape(new Ammo.btVector3(sX/2.0,sY/2.0,sZ/2.0));
        var localInertia = new Ammo.btVector3(0, 0, 0);
        brickShape.calculateLocalInertia(brickMass, localInertia);
    }
    function initGUI(panel)
    {
        labelScore = new multicrew.Label({ title: "Score: ", text: bricksFallen.toString(), x: this.canvas.width/8, 
        y: this.canvas.height/8.0, color: "#FFF", titleColor: "#ffff00" });
        panel.insert(labelScore);
    }
    function updateGUI()
    {
        if(findOnce)
        {
            if(bricksFallen<checkCastle())
            {
                bricksFallen = checkCastle();
                labelScore.text = bricksFallen;
            }
        }
    }
    function initCastle(drawObjs,shaderStruct)
    {
        var i=0;
        var lowered = false;
        for(var y=0; y<yElements; y++)
        {
            for(var x=0; x<xElements; x++)
            {
                for(var z=0; z<zElements; z++)
                {
                    if(x==0||x==xElements-1||z==0||z==zElements-1)
                    {
                        if(y==yElements-1)
                        {
                            lowered = !lowered;
                            if(lowered)
                                continue;
                        }
                        var pos = vec3.fromValues(x*sX-xOff,y*sY-yOff,z*sZ-zOff+180);
                        bricks[i] = new gObject(drawObjs,buffer,shaderStruct,pos,brickMass,brickShape);
                        bricks[i].rigidBody.setRestitution(0.0);
                        bricks[i].rigidBody.setFriction(0.5);
                        i++;
                    }
                }
            }
        }
        console.log(i+" cubes initialized");
    }
    var normalPos = new Array();
    var findOnce = false;
    function findNormalPos()
    {
        for(var i=0; i<bricks.length; i++)
        {
            normalPos.push(bricks[i].global.getPos());
        }
    }
    function checkCastle()
    {
        outOfPlaceBrick=0;
        for(var i=0; i<bricks.length; i++)
        {
            var pos = bricks[i].global.getPos();
            if(pos[0].toFixed(0) != normalPos[i][0].toFixed(0) || pos[1].toFixed(0) != normalPos[i][1].toFixed(0) 
                || pos[2].toFixed(0) != normalPos[i][2].toFixed(0))
                outOfPlaceBrick++;
        }
        if(outOfPlaceBrick>bricksFallen)
        {
            var active=true;
        }
        return outOfPlaceBrick;
    }
    this.getActive=function()
    {
        return active;
    }
    function init(panel)
    {
        makeShape(objs);
        initCastle(drawObjs,shaderStruct);
        initGUI(panel);
    }
    init(panel);
}
