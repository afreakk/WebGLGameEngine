var doc;
function webGLStart(document)
{
    doc = document;
    var canvas = getCanvas(document); 
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'brick': 'models/brick/brick.obj' , 'ground': 'models/ground/ground.obj' ,
                    'cannon':'models/cannon/cannon.obj','cannonBall':'models/cannonball/cannonBall.obj'},startApp,canvas);

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
