function webGLStart(document)
{
    var canvas = getCanvas(document); 
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'cat': 'models/cat.obj', 'cobble': 'models/cobble.obj' , 'tree':'models/tree.obj' },startApp,canvas);

    }
    else
    {
        alert("i failed you");
        return 0;
    }
}
function startApp(objs, canvas)
{
    var mgr = new Manager(canvas);
    var startLvl = 0;
    var lvlOne = new SceneOne(objs);
    var lvlTwo = new SceneTwo();
    mgr.addScene(lvlOne);
    mgr.addScene(lvlTwo);
    mgr.init(startLvl);
    mgr.animFrame();
}
