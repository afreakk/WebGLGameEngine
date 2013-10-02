
function initGL(document) 
{    
    canvas = document.getElementById("lerret");
    var gli=null;
    try
    {
        if(!canvas) throw "couldnt get canvas";
        else gli =WebGLUtils.setupWebGL(canvas); 
        if(!gli) throw "couldnt get context";
    }
    catch(rainbow)
    {
        alert(rainbow);
        return null;
    }
    scrW = canvas.width;
    scrH = canvas.height;
    return gli;
}
function initSceneMgr()
{
    this.sceneMgr=null;
    this.init = function(startLvlIndex,sceneArr)
    {
        this.sceneMgr = SceneManager();
        this.sceneMgr.init(sceneArr);
        this.sceneMgr.setLvl(startLvlIndex);
    }
    this.animFrame = function()
    {
        if(!this.sceneMgr.endGame)
        {
            this.sceneMgr.update();
            window.requestAnimFrame(this.animFrame, canvas);
        }
        else
        {
            alert("thanks for playing.");
        }
    }
    return this;
}
function webGLStart(document)
{
    if(gl = initGL(document))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        var mgr = initSceneMgr();
        var startLvl = 0;
        var lvlOne = SceneOne();
        var lvlTwo = SceneTwo();
        var sceneArr = [lvlOne, lvlTwo];
        mgr.init(startLvl,sceneArr);
        mgr.animFrame();
    }
    else
    {
        alert("i failed you");
        return 0;
    }
}







  
