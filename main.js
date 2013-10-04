function webGLStart(document)
{
    var canvas = getCanvas(document); 
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        var mgr = new Manager(canvas);
        var startLvl = 0;
        var lvlOne = new SceneOne();
        var lvlTwo = new SceneTwo();
        mgr.addScene(lvlOne);
        mgr.addScene(lvlTwo);
        mgr.init(startLvl);
        mgr.animFrame();
    }
    else
    {
        alert("i failed you");
        return 0;
    }
}


$(this).click(function()
{
    alert("clicked");
});





  
