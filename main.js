function webGLStart(document)
{
    var canvas = getCanvas(document); 
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'cube':'models/cube/cube.obj', 'ledge':'models/ledge/ledge.obj', 'dk':'models/dk/dk.obj' },startApp,canvas); 
        //for some reason cube HAS to be loaded idnowy
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
