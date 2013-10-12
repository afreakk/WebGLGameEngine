function webGLStart(document)
{
    var canvas = getCanvas(document); 
    mouse.x = 0;
    mouse.y = 0;
    if(gl = initGL(canvas))
    {
        initTextures();
        var vertexUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        var fragmentUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        var combinedUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        glMatrix.setMatrixArrayType(Float32Array);
        ObjLoader({'cat': 'models/cat/cat.obj','tree': 'models/tree/tree_oak.obj', 'ironMan' : 'models/ted/ted.obj' },startApp,canvas);
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
