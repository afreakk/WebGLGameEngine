var panel;
var label;
var lvlLabel;
function webGLStart(document)
{
    panel = new multicrew.Panel("panel");
    label = panel.insert(new multicrew.Label({ title: "KM/H", text: "0.0", x: 100, y: 100, color: "#FFF" }));
    lvlLabel = panel.insert(new multicrew.Label({ title: "Level", text: 1, x: 100, y: 300, color: "#FFF" }));

    var canvas = getCanvas(document); 
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'cube':'models/cube/cube.obj', 'ledge':'models/ledge/ledge.obj', 'dk':'models/dk/dk.obj',
        'barrel':'models/barrel/barrel.obj', 'peach':'models/peach/peach.obj'},startApp,canvas); 
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
