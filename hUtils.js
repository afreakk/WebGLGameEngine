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

function initGL(document) 
{    
    canvas = document.getElementById("lerret");
    var gli=null;
    try
    {
        if(!canvas) throw "couldnt get canvas";
        else gli =WebGLUtils.setupWebGL(canvas); 
        if(!gli) throw "couldnt get context";
    }
    catch(rainbow)
    {
        alert(rainbow);
        return null;
    }
    scrW = canvas.width;
    scrH = canvas.height;
    return gli;
}
