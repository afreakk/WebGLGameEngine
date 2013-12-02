
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
    var aMenu = null;
    var dirLight = null;
    var light = null;
    var cameraPos = vec3.fromValues(0,0,10);
    var deltaTime=0;
    var lastTime=0;
    var time=0;
    var startTime = new Date().getTime();
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
        camera = new Camera(drawObjs, cLookAt,cPos0,shaderStruct,  45.0,   0.1,  300.0,this.canvas,1.0,1.0,0.0,0.0);
        audioMgr.play("robb");
    }
    function setupMenu()
    {
        var helpTipStartPos = vec3.fromValues(0,0,-10);

        menuElements[0] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[0].useTexture('sPlay.png');
        menuElements[0].useTexture('uPlay.png');
        menuElements[1] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[1].useTexture('sHighScore.png');
        menuElements[1].useTexture('uHighScore.png');
        menuElements[2] = new gui3DElement(drawObjs,plane,shaderStruct,helpTipStartPos);
        menuElements[2].useTexture('sCredits.png'); //prebuffer image not used
        menuElements[2].useTexture('uCredits.png');
        aMenu = new MenuAnimator(menuElements,vec3.fromValues(0,0,0));
    }
    this.GLSettings= function()   //being run automatically by sceneManager
    {
        var guiShader = getShader(gl,"vs/guiShader","fs/guiShader");
        shaderStruct = new getShaderStruct(guiShader);
        setShader(shaderStruct.shader);
        gl.uniform1f(shaderStruct.alpha, 1.0 );
        setAttribs([shaderStruct.vPos,shaderStruct.uvMap,shaderStruct.normals, shaderStruct.materialIndex,shaderStruct.diffColor, 
        shaderStruct.ambColor, shaderStruct.specColor]); /*testing this seems to be working*/
        gl.enable(gl.DEPTH_TEST);
        gl.enable (gl.BLEND);
        gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    var db = 0;
    this.update = function()
    {
        handleTime();
        updateMenu();
        db += audioMgr.getDB()*100;
        gl.uniform1f(shaderStruct.iGlobalTime, db );
        gl.uniform1i(shaderStruct.strike, 1 );
        var currPos = vec3.fromValues(cameraPos[0],cameraPos[1],cameraPos[2]);
        var mDB = audioMgr.getDB()*500;
        vec3.add(currPos,currPos,vec3.fromValues((Math.random()/2.0)*mDB, (Math.random()/2.0)*mDB,(Math.random()/2.0)*mDB  ));
        camera.lookAtFrom(vec3.fromValues(0,0,0),currPos);
        this.endScene= endingScene(currPos);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
            return true;
        return false;
    }
    function updateMenu()
    {
        aMenu.update(deltaTime);
        if(key.SPACE&&aMenu.getSelected() === 0)
        {
            endScene=true;
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
