function Castle(objs,drawObjs,shaderStructX,panel,zPos)
{
    var zPosition = zPos;
    brickHit = true;

    var bricks = new Array();
    var shaderStruct = shaderStructX;
    var brickShape = null;
    var brickMass = 1.0;
    var buffer = objs['bowlingPin'].generateBuffers();
    var timeBeforeShot= 2.0; //time before we snap up the normal position of new pins
    var trans = new Ammo.btTransform();
    var vec = new Ammo.btVector3();    //every single "new" of Ammo leaks so helper vars to reduce leak
    var zeroVec = new Ammo.btVector3(0,0,0);

    var unCertainPins = [];
    var yElements = 1;
    var xElements = 4;
    var zElements = 5;
    var sX=1.0,sY=2.75,sZ=1.0;
    var xOff = sX*xElements/2.0;
    var yOff = yElements*(sY*2.0)+4.4; 
    var zOff = sZ*zElements/2.0+10.0;
    var bricksFallen = 0; 
    var labelScore = null;
    var labelTotalScore = null;
    var labelRoundCount = null;
    var labelMultiplier = null;
    var totalScoreStr = 0;
    var RoundTimer = 0;
    var roundCountStr = 0;
    var hasHit = [];
    var rollCount = 0;
    var typeShotString = " ";
    var normalPos = new Array();
    var hasNormalPositions = false;
    var pinWobbling=false;
    var firstThrowScore=0;
    var secondThrowScore=0;
    var firstThrow=null;
    var lastThrowRealValue = 0;
    var lastThrow=0;
    var scoreMultiplier=0;
    var bricksFallenRealValue=0;
    var rollsLeft = 2;
    this.getBrickHit=function()
    {
        return brickHit;
    }
    this.setBrickhit=function(inBrickhit)
    {
        if(brickHit !== inBrickhit)
        {
            brickHit = inBrickhit;
            if(scoreMultiplier>0)
                scoreMultiplier --;
        }
    }
    var musicPower=0;
    function handleFX(dt)
    {
        if(scoreMultiplier > 0)
        {
            musicPower += audioMgr.getDB("brothers")*20.0;
            gl.uniform1f(shaderStruct.iGlobalTime, musicPower );
            gl.uniform1i(shaderStruct.strike, 1 );
            audioMgr.pauseSpec("robb");
            audioMgr.playSpec("brothers");
            labelMultiplier.db = musicPower/2.0;
            if(labelMultiplier.crazyMode !==true)
                labelMultiplier.crazyMode=true;
        }
        else
        {
            gl.uniform1i(shaderStruct.strike, 0 );
            audioMgr.pauseSpec("brothers");
            audioMgr.playSpec("robb");
            if(labelMultiplier.crazyMode !== false)
                labelMultiplier.crazyMode = false;
        }
    }
    this.update=function(deltaTime)
    {
        handleFX(deltaTime);
        if(RoundTimer>timeBeforeShot)
        {
            if(!hasNormalPositions)
            {
                findNormalPos();
            }
            updateTypeShot();
        }
        handleScoring(deltaTime);
        updateGUI();
        removeUnusedPins();
        RoundTimer += deltaTime;
    }
    function handleScoring(dt)
    {
        var fallenCount = checkCastle(dt);
        if(fallenCount !== bricksFallenRealValue)
        {
            lastThrowRealValue = fallenCount-bricksFallenRealValue;
            lastThrow = lastThrowRealValue * ((scoreMultiplier>0)?2:1);
            bricksFallen += lastThrow;
            bricksFallenRealValue += lastThrowRealValue;
        }
    }
    function removeUnusedPins()
    {
        trans.setIdentity();
        if(!brickHit)
        {
            for(var i=0; i<bricks.length; i++)
            {
                if(hasHit[i] === true)
                {
                    var xP= 0;
                    var yP= -100;
                    var zP= 0;

                    vec.setX(xP);
                    vec.setY(yP);
                    vec.setZ(zP);
                    trans.setOrigin(vec);
                    bricks[i].rigidBody.setCenterOfMassTransform(trans);
                    bricks[i].rigidBody.clearForces();
                    bricks[i].rigidBody.setLinearVelocity(zeroVec);
                    bricks[i].rigidBody.setAngularVelocity(zeroVec);
                }
            }
        }
    }
    this.setRollCount=function(inRollCount)
    {
        if(rollCount !== inRollCount)
        {
            rollCount = inRollCount;
            firstThrow = (rollCount%2)?true:false;
        }
    }
    function updateTypeShot()
    {
        if(bricksFallenRealValue == 10)
        {
            if(firstThrow && typeShotString!=="Strike!")
            {
                typeShotString = "Strike!";
                while(scoreMultiplier<3)
                    scoreMultiplier ++;
            }
            else if(!firstThrow && typeShotString !== "Spare!")
            {
                typeShotString = "Spare!";
                while(scoreMultiplier<2)
                    scoreMultiplier ++;
            }
        }
        else if(lastThrowRealValue == 0)
        {
            typeShotString = "GutterBall";
        }
        else
        {
            typeShotString = " ";
        }

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
        labelMultiplier = new multicrew.Label({ title: "ScoreMultiplier: ", text: (scoreMultiplier>0)?"2X":"1X", x: this.canvas.width/8, y: 
        this.canvas.height-this.canvas.height/16.0, color: "#FFF", titleColor: "#ffff00" });
        labelScore = new multicrew.Label({ title: "Round Score", text: bricksFallen.toString(), x: this.canvas.width/8, 
        y: this.canvas.height/8.0, color: "#FFF", titleColor: "#ffff00" });
        labelTotalScore = new multicrew.Label({ title: "Total Score", text: totalScore(), x: this.canvas.width/2, y:this.canvas.height/8.0
        , color: "#FFF", titleColor: "#ffff00" });
        labelRoundCount = new multicrew.Label({title: "Round #", text: roundCount(), x:this.canvas.width-this.canvas.width/8,
        y: this.canvas.height-this.canvas.height/16.0, color: "#FFF", titleColor: "#ffff00" });
        panel.insert(labelRoundCount);
        panel.insert(labelTotalScore);
        panel.insert(labelScore);
        panel.insert(labelMultiplier);
    }
    function roundCount()
    {
        return roundCountStr;
    }
    this.getRoundCount=function()
    {
        return roundCount();
    }
    this.getTotalScore=function()
    {
        return totalScore();
    }
    function totalScore()
    {
        return totalScoreStr;
    }
    this.getTypeShotStr  = function()
    {
        return typeShotString;
    }
    function updateGUI()
    {
        labelScore.text = bricksFallen;
        labelTotalScore.text = totalScore();
        labelRoundCount.text = roundCount();
        labelMultiplier.text = (scoreMultiplier>0)?"2X":"1X";
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
        if(RoundTimer > timeBeforeShot+1.0)
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
            timeSinceLastPlong[i] = 0;
        }
        typeShotString = " ";
        totalScoreStr += bricksFallen;
        roundCountStr ++;
        bricksFallen = 0;
        bricksFallenRealValue = 0;
        hasNormalPositions = false;
        RoundTimer = 0;
    }
    function resetVarsLastRound()
    {
        for(var i=0; i<bricks.length; i++)
        {
            hasHit[i] = false;
            unCertainPins[i] = false;
            timeSinceLastPlong[i] = 0;
        }
        typeShotString = " ";
        totalScoreStr += bricksFallen;
        bricksFallen = 0;
        bricksFallenRealValue = 0;
        hasNormalPositions = false;
        RoundTimer = 0;
    }
    function reset()
    {
        trans.setIdentity();
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
        if(scoreMultiplier > 0 && roundCount()===12)
        {
            rollsLeft = scoreMultiplier;
            resetVarsLastRound();
        }
        else
            resetVars();
    }
    this.getRollsLeft=function()
    {
        return rollsLeft;
    }
    this.reset= function()
    {
        reset();
    }
    function findNormalPos()
    {
        normalPos.length  =  0;
        for(var i=0; i<bricks.length; i++)
        {
            normalPos.push(bricks[i].global.getPos());
        }
        hasNormalPositions= true;
    }
    var dist = new Array();
    var timeSinceLastPlong = new Array();
    var plongTimeTreshold = 0.1;
    function checkIfSound(lastVec, nowVec,index)
    {
        var suddenChangeTreshold = 3.0;
        var thisDist = vec3.distance(lastVec,nowVec);
        var distanceDistance = (thisDist-dist[index])*(thisDist-dist[index]);
        if( distanceDistance > suddenChangeTreshold && timeSinceLastPlong[index] > plongTimeTreshold)
        {
            timeSinceLastPlong[index]=0.0;
            audioMgr.playSequential('pin',distanceDistance/20);
        }
        dist[index] = thisDist;
    }
    var linearVelocity=new Array();
    function checkCastle(dt)
    {
        if(hasNormalPositions)
        {
            var scorePinYTreshold = -10.3;
            var velocityHitTreshold = 0.25;
            var squaredDistanceTreshold = 2.0;
            for(var i=0; i<bricks.length; i++)
            {
                timeSinceLastPlong[i] += dt;
                var brickY = bricks[i].rigidBody.getCenterOfMassPosition().getY();
                var angVelocity = bricks[i].rigidBody.getAngularVelocity();
                linearVelSingle = [bricks[i].rigidBody.getLinearVelocity().getX(),bricks[i].rigidBody.getLinearVelocity().getY()
                ,bricks[i].rigidBody.getLinearVelocity().getZ()];
                if(!hasHit[i])
                {
                    if(linearVelocity[i] !== undefined)
                        checkIfSound(linearVelocity[i],linearVelSingle,i);
                    linearVelocity[i] = linearVelSingle
                }
                var totalVelocity = (Math.abs( angVelocity.getX() ) +Math.abs( angVelocity.getY() ) +Math.abs( angVelocity.getZ() ))
                +Math.abs( (linearVelSingle[0] )+Math.abs(linearVelSingle[1])+Math.abs(linearVelSingle[2]));
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
