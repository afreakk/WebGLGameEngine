function webGLStart(document)
{
    var canvas = getCanvas(document); 
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'cat': 'models/cat/cat.obj','tree': 'models/tree/tree_oak.obj', 'ted' : 'models/ted/ted.obj' ,
                    'amy' : 'models/amy/amyrose.obj' },startApp,canvas);
    }
    else
    {
        alert("i failed you");
        return 0;
    }
}
function startApp(meshes, canvas)
{
    var mgr = new Manager(canvas);
    var startLvl = 0;
    var lvlOne = new SceneOne(meshes);
    var lvlTwo = new SceneTwo();
    mgr.addScene(lvlOne);
    mgr.addScene(lvlTwo);
    mgr.init(startLvl);
    mgr.animFrame();
}
