function Castle(objs,drawObjs,shaderStructX,panel,zPos)
{
    var zPosition = zPos;
    brickHit = true;

    var bricks = new Array();
    var shaderStruct = shaderStructX;
    var brickShape = null;
    var brickMass = 1.0;
    var buffer = objs['bowlingPin'].generateBuffers();

    var unCertainPins = [];
    var yElements = 1;
    var xElements = 4;
    var zElements = 5;
    var sX=1.0,sY=2.75,sZ=1.0;
    var xOff = sX*xElements/2.0;
    var yOff = yElements*(sY*2.0)+4.5; 
    var zOff = sZ*zElements/2.0+10.0;
    var bricksFallen = 0; 
    var labelScore = null;
    var labelTotalScore = null;
    var labelRoundCount = null;
    var totalScoreStr = 0;
    var RoundTimer = 0;
    var roundCountStr = 0;
    this.getBrickHit=function()
    {
        return brickHit;
    }
    this.setBrickhit=function(clau)
    {
        brickHit = clau;
    }
    this.update=function(deltaTime)
    {
        RoundTimer += deltaTime;
        if(!hasNormalPositions&&RoundTimer>8.0)
        {
            findNormalPos();
        }
        updateGUI();
    }
    function makeShape()
    {
        var rectangleShape = new Ammo.btCylinderShape(new Ammo.btVector3(sX/2.0,(sY/8.0)*3,sZ/2.0));
/*        var sphereShape = new Ammo.btSphereShape(sY/8.0);
        
        var trans = new Ammo.btTransform();
        var btVec = new Ammo.btVector3(0,0,0);
        btVec.setY(-(sY/4.0));
        trans.setOrigin(btVec);
        brickShape = new Ammo.btCompoundShape();
        brickShape.addChildShape(trans,sphereShape);*/
        brickShape = rectangleShape;

    }
    function initGUI(panel)
    {
        labelScore = new multicrew.Label({ title: "Round Score", text: bricksFallen.toString(), x: this.canvas.width/8, 
        y: this.canvas.height/8.0, color: "#FFF", titleColor: "#ffff00" });
        labelTotalScore = new multicrew.Label({ title: "Total Score", text: totalScore(), x: this.canvas.width/2, y:this.canvas.height/8.0
        , color: "#FFF", titleColor: "#ffff00" });
        labelRoundCount = new multicrew.Label({title: "Round #", text: roundCount(), x:this.canvas.width-this.canvas.width/8,
        y: this.canvas.height-this.canvas.height/8.0, color: "#FFF", titleColor: "#ffff00" });
        panel.insert(labelRoundCount);
        panel.insert(labelTotalScore);
        panel.insert(labelScore);
    }
    function roundCount()
    {
        return roundCountStr;
    }
    function totalScore()
    {
        return totalScoreStr;
    }
    function updateGUI()
    {
        bricksActuallyFallen = checkCastle();
        bricksFallen = bricksActuallyFallen;
        labelScore.text = bricksFallen;
        labelTotalScore.text = totalScore();
        labelRoundCount.text = roundCount();
    }
    function initCastle(drawObjs,shaderStruct)
    {
        smx = xElements;
        var i=0;
        for (var z=0; z<zElements; z++)
        {
            for(var x=0; x<smx; x++)
            {
                for(var y=0; y<yElements; y++)
                {
                    var xP= x*(sX*1.5)-(smx*(sX*1))/2.0;
                    var yP= y*(sY*1.0)-yOff;
                    var zP= z*(sZ*2.5)-zOff+zPosition;

                    var pos = vec3.fromValues(xP, yP, zP);
                    bricks[i] = new gObject(drawObjs,buffer,shaderStruct,pos,brickMass,brickShape);
                    bricks[i].rigidBody.setRestitution(0.0);
                    bricks[i].rigidBody.setFriction(0.5);
                    bricks[i].rigidBody.setFriction(0.5);
                    bricks[i].rigidBody.setActivationState(4);
                    i++;
                }
            }
            smx -=1;
        }
        console.log(i+" cubes initialized");
        resetVars();
    }
    this.isAllowedToShoot=function()
    {
        if(RoundTimer > 4.0)
            return true;
        else
            return false;
    }
    function resetVars()
    {
        for(var i=0; i<bricks.length; i++)
        {
            hasHit[i] = false;
            unCertainPins[i] = false;
        }
        totalScoreStr += bricksFallen;
        roundCountStr ++;
        bricksFallen = 0;
        hasNormalPositions = false;
        RoundTimer = 0;
    }
    function reset()
    {
        smx = xElements;
        var i=0;
        var trans = new Ammo.btTransform();
        var vec = new Ammo.btVector3();
        var zeroVec = new Ammo.btVector3(0,0,0);
        for (var z=0; z<zElements; z++)
        {
            for(var x=0; x<smx; x++)
            {
                for(var y=0; y<yElements; y++)
                {
                    var xP= x*(sX*1.5)-(smx*(sX*1))/2.0;
                    var yP= y*(sY*1.0)-yOff;
                    var zP= z*(sZ*2.5)-zOff+zPosition;

                    vec.setX(xP);
                    vec.setY(yP);
                    vec.setZ(zP);
                    trans.setOrigin(vec);
                    bricks[i].rigidBody.setCenterOfMassTransform(trans);
                    bricks[i].rigidBody.clearForces();
                    bricks[i].rigidBody.setLinearVelocity(zeroVec);
                    bricks[i].rigidBody.setAngularVelocity(zeroVec);
                    i++;
                }
            }
            smx -=1;
        }
        console.log(" cubes initialized");
        resetVars();
    }
    this.reset= function()
    {
        reset();
    }
    var normalPos = new Array();
    var hasNormalPositions = false;
    function findNormalPos()
    {
        normalPos.length  =  0;
        for(var i=0; i<bricks.length; i++)
        {
            normalPos.push(bricks[i].global.getPos());
        }
        hasNormalPositions= true;
    }
    var hasHit = [];
    function checkCastle()
    {
        scorePinYTreshold = -10.3;
        velocityHitTreshold = 0.25;
        squaredDistanceTreshold = 2.0;
        if(hasNormalPositions)
        {
            for(var i=0; i<bricks.length; i++)
            {
                var brickY = bricks[i].rigidBody.getCenterOfMassPosition().getY();
                var angVelocity = bricks[i].rigidBody.getAngularVelocity();
                var linearVelocity = bricks[i].rigidBody.getLinearVelocity();

                var totalVelocity = (Math.abs( angVelocity.getX() ) +Math.abs( angVelocity.getY() ) +Math.abs( angVelocity.getZ() ))
                +Math.abs( (linearVelocity.getX() )+Math.abs(linearVelocity.getY())+Math.abs(linearVelocity.getZ()));
                if(totalVelocity > velocityHitTreshold)
                {
                    if(hasHit[i]!==true)
                    {
                        brickHit = true;
                        if(brickY>scorePinYTreshold)
                            unCertainPins[i] = true;
                    }
                }
                else
                    unCertainPins[i] = false;

                if(brickY <= scorePinYTreshold)
                {
                    unCertainPins[i] = false;
                    hasHit[i] = true;
                }
                else if(vec3.squaredDistance(normalPos[i],bricks[i].global.getPos()) > squaredDistanceTreshold)
                {
                    unCertainPins[i] = false;
                    hasHit[i] = true;
                }
            }
        }
        var outOfPlaceBrick =0;
        var countUncertainPins= 0;
        for(var i=0; i<bricks.length; i++)
        {
            outOfPlaceBrick += hasHit[i]?1:0;
            countUncertainPins += unCertainPins[i]?1:0;
        }
        pinWobbling = countUncertainPins>0?true:false;
        return outOfPlaceBrick;
    }
    var pinWobbling=false;
    this.getWobbling=function()
    {
        return pinWobbling;
    }
    function init(panel)
    {
        makeShape();
        initCastle(drawObjs,shaderStruct);
        initGUI(panel);
    }
    init(panel);
}
