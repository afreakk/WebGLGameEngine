/////global vars
var doc;
var panelCanvas;

var SRED = 0.05;
var SBLUE = 0.05;
var SGREEN = 0.001;
//////////
var audioMgr = null;
function webGLStart(document)
{
    doc = document;
    canvas = getCanvas(document,"lerret"); 
    panelCanvas = getCanvas(document,"panel");
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        showLoading();
        gl.clearColor(SRED, SGREEN, SBLUE, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        audioMgr = new AudiManager();
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
    var plane = meshes['plane'].generateBuffers();
    var mgr = new Manager(canvas,meshes, plane);
    var startLvl = 0;
    removeLoading();
    mgr.init(startLvl);
    mgr.animFrame();
}
