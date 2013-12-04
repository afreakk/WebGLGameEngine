var insertHighScoreMode = false;
function SceneTwo(Objs,Plane)
{
    this.endScene=false;
    this.nextLvl=1;           //public variables to show when and what nextlvl is
    this.canvas=null;        //size and stuff set each frame by resizeHandling
    var endScene=false;
    var panel= null;
    var objs = Objs;
    var plane = Plane;
    var camera= null;
    var shaderStruct = null;
    var drawObjs = new DrawableObjects();
    var menuElements= new Array();
    var highScoreElements = new Array();
    var aMenu = null;
    var dirLight = null;
    var light = null;
    var cameraPos = vec3.fromValues(0,0,10);
    var deltaTime=0;
    var lastTime=0;
    var time=0;
    var startTime = new Date().getTime();
    var mState = insertHighScoreMode?"insertHighScore":"mainMenu";
    var insertHighScoreElements = new Array();
    var highScoreList = null;
    var lerpToSub = insertHighScoreMode?1:0;
    var SubDepth = 12.0;
    var insertHighScoreMenu = null;
    var loadingAnim = null;
    var waitTime = 0;
    var currentDB = 0;
    this.init = function()
    {
        var lightColor = vec3.fromValues(1.0,0.95,0.9);
        var lightPos = vec3.fromValues(1.0, 1.0, -10.0);
        light = new PointLight(shaderStruct, 50.0,lightColor, lightPos);
        var direction = vec3.fromValues(1.0,1.0,1.0);
        dirLight = new DirectionalLight(shaderStruct,direction,2.5);

        setupMenu();
        var cPos0    = vec3.fromValues(0.0,0.0,-10.0);
        var cLookAt = vec3.fromValues(0.0,0.0,10.0);
        camera = new Camera(drawObjs, cLookAt,cPos0,shaderStruct,  45.0,   0.1,  300.0,this.canvas,1.0,1.0,0.0,0.0,true);
        audioMgr.playSpec("robb");
        if(insertHighScoreMode===false)
            initHighscoreList();
    }
    function setupMenu()
    {
        var helpTipStartPos = vec3.fromValues(0,0,-400);

        menuElements[0] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[0].useTexture('sPlay.png');
        menuElements[0].useTexture('uPlay.png');
        menuElements[1] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[1].useTexture('sHighScore.png');
        menuElements[1].useTexture('uHighScore.png');
        menuElements[2] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[2].useTexture('sCredits.png'); //prebuffer image not used
        menuElements[2].useTexture('uCredits.png');
        aMenu = new MenuAnimator(menuElements,vec3.fromValues(0,0,5.0));
        aMenu.setSwitchImage(true);
    }
    this.GLSettings= function()   //being run automatically by sceneManager
    {
        var guiShader = getShader(gl,"vs/guiShader","fs/guiShader");
        setShader(guiShader);
        shaderStruct = new getShaderStruct(guiShader);
        gl.uniform1f(shaderStruct.alpha, 1.0 );
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex,shaderStruct.diffColor, 
        shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.enable(gl.DEPTH_TEST);
        gl.enable (gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    this.update = function()
    {
        audioMgr.playSpec("robb");
        currentDB = Math.max(audioMgr.getDB("robb")*.8+audioMgr.getDB("roboTrans")*.8,0.001);
        handleTime();
        updateMenu();
        this.endScene= endingScene(cameraPos);
        gl.clearColor(SRED, SGREEN, SBLUE, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        camera.update(); //needs to be called each update for each camera
        camera.draw();
    }
    var timeOut = Math.PI;
    function endingScene(currPos)
    {
        if(!endScene)
            return false;
        timeOut -= deltaTime/1.0;
        camera.lookAtFrom(vec3.add(vec3.create(),vec3.fromValues(Math.sin(timeOut),0,Math.cos(timeOut)),currPos),currPos);
        if(timeOut <=Math.PI/4.0)
        {
            insertHighScoreMode = false;
            return true;
        }
        return false;
    }
    var countingDB = 0;
    var tickType = "|";
    function updateMenu()
    {
        injectHighscore();
        var currPos = vec3.fromValues(cameraPos[0],cameraPos[1],cameraPos[2]);
        countingDB += currentDB*50.0;
        var mDB = currentDB*500;
        if(mState === "mainMenu")
        {
            mDB /= 10.0;
            aMenu.update(deltaTime);
            vec3.add(currPos,currPos,vec3.fromValues((Math.random()/2.0)*mDB, (Math.random()/2.0)*mDB,(Math.random()/2.0)*mDB  ));
            if(key.SPACE&&aMenu.getSelected() !== null&&lerpToSub<=0.0)
                switchState()
            if(lerpToSub>0.0)
                lerpToSub -= deltaTime; 
            gl.uniform1f(shaderStruct.iGlobalTime, countingDB );
            gl.uniform1i(shaderStruct.strike, 3 );
            strikeCount = 3;
        }
        else if(mState === "highScore")
        {
            mDB /= 20.0;
            if(highScoreList !== null)
                highScoreList.update(deltaTime);
            vec3.add(currPos,currPos,vec3.fromValues((Math.random()/2.0)*mDB, (Math.random()/2.0)*mDB,(Math.random()/2.0)*mDB  ));
            if(lerpToSub<1.0)
                lerpToSub += deltaTime; 

            if(key.SPACE&&highScoreList.getSelected() === 0&&lerpToSub>=1.0)
                mState = "mainMenu";
            gl.uniform1f(shaderStruct.iGlobalTime, countingDB );
            gl.uniform1i(shaderStruct.strike, 9 );
            strikeCount = 9;
        }
        else if(mState === "insertHighScore")
        {
            gl.uniform1f(shaderStruct.iGlobalTime, countingDB );
            gl.uniform1i(shaderStruct.strike, 6 );
            strikeCount = 6;
            mDB/= 140.0;
            if(insertHighScoreMenu === null)
                injectInsertHighScore();
            insertHighScoreMenu.update(deltaTime);
            insertHighScoreElements[2].setText(textOutput.getString()+tickType,true);
            vec3.add(currPos,currPos,vec3.fromValues((Math.random()/2.0)*mDB, (Math.random()/2.0)*mDB,(Math.random()/2.0)*mDB  ));
            if(key.ENTER===true)
            {
                insertToHighscoreDatabase(textOutput.getString());
                mState = "wait";
                waitTime = 0;
                hideAll(insertHighScoreElements);
            }
        }
        else if(mState === "wait")
        {
            mDB/= 20.0;
            gl.uniform1f(shaderStruct.iGlobalTime, countingDB );
            gl.uniform1i(shaderStruct.strike, 6 );
            strikeCount = 6;
            waitTime += deltaTime;
            vec3.add(currPos,currPos,vec3.fromValues((Math.random()/2.0)*mDB, (Math.random()/2.0)*mDB,(Math.random()/2.0)*mDB  ));
            if(loadingAnim===null)
                loadingAnim = new gui3DElement(drawObjs, plane, shaderStruct, vec3.fromValues(0,-SubDepth-0.5,-SubDepth/4.0));
            loadingAnim.global.translate(vec3.fromValues(0,-deltaTime,-deltaTime));
            loadingAnim.setText("Please wait, time elapsed: "+waitTime.toFixed(4));
            if(highScoreUploaded === true)
            {
                if(queryFound === true)
                {
                    loadingAnim.setHidden(true);
                    initHighscoreList();
                    highScoreUploaded = false;
                    mState = "highScore";
                }
                else
                {
                    queryEntry();
                }
            }
        }
        var camPos = vec3.create();
        vec3.lerp(camPos,currPos,vec3.add(vec3.create(),currPos,vec3.fromValues(0,-SubDepth,-10)), lerpToSub);
        camera.lookAtFrom( vec3.add(vec3.create(), camPos,vec3.fromValues(0,0,-1)),camPos);

    }
    function injectInsertHighScore()
    {
        var helpTipStartPos = vec3.fromValues(0,0,-400);
        insertHighScoreElements[0] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        insertHighScoreElements[0].setText("Your Score:"+lastActualScore); 
        insertHighScoreElements[1] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        insertHighScoreElements[1].setText("Nick:"); 
        insertHighScoreElements[2] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        insertHighScoreElements[2].setText("exampleNick"); 
        insertHighScoreMenu = new MenuAnimator(insertHighScoreElements,vec3.fromValues(0,-(SubDepth+0.5),-3),-SubDepth*1.01,-1,2.0,false,0.8);
        insertHighScoreMenu.setNoControl(true);
        textOutput = new TextOutput();
    }
    function injectHighscore()
    {
        var helpTipStartPos = vec3.fromValues(0,0,-400);
        if(foundHighScoreListP===true)
        {
            for(var i=0; i<highScoreListP.length; i++)
            {
                highScoreElements[i+1] = new gui3DElement(drawObjs, plane, shaderStruct, helpTipStartPos);
                highScoreElements[i+1].setText(highScoreListP[i]);
            }
            highScoreList = new MenuAnimator(highScoreElements,vec3.fromValues(-2.5,-SubDepth,-3.0),-2.75-SubDepth,-6,1.4,true);
            foundHighScoreListP = false;
        }
    }
    function initHighscoreList()
    {
        var helpTipStartPos = vec3.fromValues(0,0,-400);
        highScoreElements[0] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        highScoreElements[0].setText("Back"); 
        getTopTen();
    }
    function switchState()
    {
        switch(aMenu.getSelected())
        {
            case 0: endScene = true; break;
            case 1: mState = "highScore"; break;
            case 2:/* mState = "credits"*/; break;
        }
    }
    function handleTime()
    {
        var now = new Date().getTime()-startTime;
        deltaTime = (now - lastTime)/1000;
        time += deltaTime;
        lastTime = now;
    }
}
function hideAll(elements)
{
    for(var i=0; i<elements.length; i++)
    {
        elements[i].setHidden(true)
    }
}
