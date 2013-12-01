/////global vars
var doc;
var panelCanvas;



//////////
function webGLStart(document)
{
    doc = document;
    canvas = getCanvas(document,"lerret"); 
    panelCanvas = getCanvas(document,"panel");
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({  'ground': 'models/ground/ground.obj' , 'plane' : 'models/plane/plane.obj',
                    'cannon':'models/cannon/cannon.obj','cannonBall':'models/cannonball/cannonBall.obj', 'particle':'models/particle/particle.obj',
                    'wall':'models/wall/wall.obj', 'bowlingPin':'models/bowlingpin/bowlingpin.obj'},startApp,canvas);

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
