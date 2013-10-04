function getShaderStruct(shaderProgram)
{
    this.vPos= gl.getAttribLocation(shaderProgram, "vPos");
    this.vCol= gl.getAttribLocation(shaderProgram, "vCol");
    this.pMat= gl.getUniformLocation(shaderProgram, "pMat");
    this.mMat= gl.getUniformLocation(shaderProgram, "mMat");
    this.vMat= gl.getUniformLocation(shaderProgram, "vMat");
    this.shader = shaderProgram;
}

function setShader(shader)
{
    if(shader != setShader.lastUsed)
    {
        setShader.lastUsed=shader;
        gl.useProgram(shader);
    }
}
setShader.lastUsed;

function setAttribs(attribLocArray)
{
    var tempStatic = setAttribs.aLocArr;
    setAttribs.aLocArr = attribLocArray;
    for(var j=0; j<attribLocArray.length; j++)
    {
        var activeLoc = attribLocArray[j];
        for(var i=0; i<tempStatic.length; i++)
        {
            if(tempStatic[i]==activeLoc)
            {
               attribLocArray[j]= null;
               tempStatic[i] = null;
               break;
            }
        }
    }
    // not 100% sure this is working as intended,, we'll see...
    for(var i=0; i<tempStatic.length; i++)
    {
        if(tempStatic[i] != null)
            gl.disableVertexAttribArray(tempStatic[i]);
    }
    for(var i=0; i<attribLocArray.length; i++)
    {
        if(attribLocArray[i] != null)
            gl.enableVertexAttribArray(attribLocArray[i]);
    }
}
setAttribs.aLocArr= new Array();
function getCanvas(document)
{
    var canvas = document.getElementById("lerret");
    return canvas;
}
function initGL(canvas) 
{    
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
    return gli;
}

function setMatrixPRS(posV, rotQ, scaleV, matLoc) 
{
    var modelMatrix= mat4.create();
    modelMatrix = mat4.fromRotationTranslation(modelMatrix, rotQ, posV);
    modelMatrix = mat4.scale(modelMatrix,modelMatrix,scaleV);
    gl.uniformMatrix4fv(matLoc, false, modelMatrix);
}

function setMatrix(matrix,matLoc)
{
    gl.uniformMatrix4fv(matLoc,false,matrix);
}
function quatFromMatrix(matrix) {
	var w = Math.sqrt(1.0 + matrix[0] + matrix[5] + matrix[10]) / 2.0;
	var w4 = (4.0 * w);
	var x = (matrix[6] - matrix[9]) / w4 ;
	var y = (matrix[8] - matrix[2]) / w4 ;
	var z = (matrix[1] - matrix[4]) / w4 ;
    return quat.fromValues(x, y, z, w);
}

function setMatrixPR(posV, rotQ, matLoc) 
{
    var modelMatrix= mat4.create();
    modelMatrix = mat4.fromRotationTranslation(modelMatrix, rotQ, posV);
    gl.uniformMatrix4fv(matLoc, false, modelMatrix);
}
