function webGLStart(document)
{
    alert("wtf");
    if(gl = initGL(document))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        var mgr = new Manager();
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







  
