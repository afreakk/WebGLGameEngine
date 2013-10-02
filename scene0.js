function setProjection(fov,near,far,matLoc) 
{
    var pMatrix = mat4.create();
    mat4.identity(pMatrix);
    pMatrix = mat4.perspective(pMatrix, fov, scrW/scrH, near, far);
    gl.uniformMatrix4fv(matLoc, false, pMatrix);
}
function getShaderLocations(shaderProgram)
{
    this.vPos= null;
    this.vCol= null;
    this.pMat = null;
    this.mMat = null;
    this.vMat = null;
    this.shader = null;
    this.init = function()
    {
        this.vPos= gl.getAttribLocation(shaderProgram, "vPos");
        this.vCol= gl.getAttribLocation(shaderProgram, "vCol");
        this.pMat= gl.getUniformLocation(shaderProgram, "pMat");
        this.mMat= gl.getUniformLocation(shaderProgram, "mMat");
        this.vMat= gl.getUniformLocation(shaderProgram, "vMat");
        this.shader = shaderProgram;
    }
    this.init();
    return this;
}

function setAttribs(attribLocArray)
{
    var staticSplices = new Array();
    var newSplices = new Array();
    var tempStatic = setAttribs.aLocArr;
    setAttribs.aLocArr = attribLocArray;
    for(var j=0; j<attribLocArray.length; j++)
    {
        var activeLoc = attribLocArray[j];
        for(var i=0; i<tempStatic.length; i++)
        {
            if(tempStatic[i]==activeLoc)
            {
               staticSplices.push(i);
               newSplices.push(j);
               break;
            }
        }
    }
    for(var i=0; i<staticSplices.length; i++)
        tempStatic.splice(staticSplices[i],1);
    for(var i=0; i<tempStatic.length; i++)
        gl.disableVertexAttribArray(tempStatic[i]);
    for(var i=0; i<newSplices.length; i++)
        attribLocArray.splice(newSplices[i],1);
    for(var i=0; i<attribLocArray.length; i++)
        gl.enableVertexAttribArray(attribLocArray[i]);
}
setAttribs.aLocArr= new Array();

function SceneOne()
{
    this.endScene=false;
    this.nextLvl=1;
    this.shaderStruct=null;
    this.obj0=null;
    this.obj1=null;
    this.time=0;
    this.init = function()
    {
        var shader = getShader(gl,"vs/vShader","fs/fShader");
        shaderStruct = getShaderLocations(shader);
        gl.useProgram(shaderStruct.shader);
        setAttribs([shaderStruct.vPos,shaderStruct.vCol]);
//        gl.enableVertexAttribArray(shaderStruct.vPos);
  //      gl.enableVertexAttribArray(shaderStruct.vCol);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0,scrW , scrH);
        setProjection(45.0, 0.1, 100.0,shaderStruct.pMat);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var cPos = vec3.fromValues(0.0,0.0,0.0);
        var cLookAt = vec3.fromValues(0.0,0.0,-10.0);
        var cam = Camera(cPos,cLookAt,shaderStruct.vMat); 

        var pos1 = vec3.fromValues(-2.5,0.0,-10.0);
        var tri = triangle();
        obj0 =ParticleNoIndex(tri,shaderStruct);
        obj0.pos = pos1;
        obj0.draw();
        
        var pos2 = vec3.fromValues(2.0,0.0,-10.0);
        obj1 = ParticleIndexed(iSquare(),shaderStruct);
        obj1.pos = pos2;
        obj1.draw();
        console.error("sceneOne init");
    }
    this.update = function()
    {
        gl.clearColor(this.time, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        obj0.draw();
        obj1.draw();
        this.time += 0.1;
        console.error("sceneOne Update");

    }
    return this;
}

function SceneTwo()
{
    this.endScene=false;
    this.nextLvl=1;
    this.init = function()
    {
        alert("SceneTwo not implemented");
    }
    this.update = function()
    {
        console.error("sceneTwo update");
    }
    return this;
}
