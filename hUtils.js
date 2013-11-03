/*
function matToQuat(matrix) 
{
	var w = Math.sqrt(1.0 + matrix[0] + matrix[5] + matrix[10]) / 2.0;
	var w4 = (4.0 * w);
	var x = (matrix[6] - matrix[9]) / w4 ;
	var y = (matrix[8] - matrix[2]) / w4 ;
	var z = (matrix[1] - matrix[4]) / w4 ;
    return quat.fromValues(x, y, z, w);
}*/
function toRad(a)
{
     return a * (Math.PI / 180);
}
function setMatrixPR(matrix, posV, rotQ, matLoc) 
{
    mat4.fromRotationTranslation(matrix, rotQ, posV);
    gl.uniformMatrix4fv(matLoc, false, modelMatrix);
}
function getShaderStruct(shaderProgram)
{
    this.vPos= gl.getAttribLocation(shaderProgram, "vPos");
    this.uvMap = gl.getAttribLocation(shaderProgram, "uvMap");
    this.normals = gl.getAttribLocation(shaderProgram, "normals");
    this.diffColor = gl.getAttribLocation(shaderProgram, "diffColor");
    this.ambColor = gl.getAttribLocation(shaderProgram, "ambColor");
    this.specColor = gl.getAttribLocation(shaderProgram, "specColor");
    this.materialIndex = gl.getAttribLocation(shaderProgram, "materialIndex");
    this.pMat= gl.getUniformLocation(shaderProgram, "pMat");
    this.mMat= gl.getUniformLocation(shaderProgram, "mMat");
    this.vMat= gl.getUniformLocation(shaderProgram, "vMat");
    this.lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    this.LightColor= gl.getUniformLocation(shaderProgram, "LightColor");
    this.LightPower= gl.getUniformLocation(shaderProgram, "LightPower");
    this.DirectionalLight = gl.getUniformLocation(shaderProgram, "DirectionalLight");
    this.DirectionalPower = gl.getUniformLocation(shaderProgram, "DirectionalPower");
    this.samplerCount = gl.getUniformLocation(shaderProgram, "samplerCount");
    this.texSamplers = new Array();
    this.texSamplers[0] = gl.getUniformLocation(shaderProgram, "texSampler0");
    this.texSamplers[1] = gl.getUniformLocation(shaderProgram, "texSampler1");
    this.texSamplers[2] = gl.getUniformLocation(shaderProgram, "texSampler2");
    this.texSamplers[3] = gl.getUniformLocation(shaderProgram, "texSampler3");
    this.shadeEqualsOne = gl.getUniformLocation(shaderProgram, "shade");
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
        if(tempStatic[i] !== null)
            gl.disableVertexAttribArray(tempStatic[i]);
    }
    for(var i=0; i<attribLocArray.length; i++)
    {
        if(attribLocArray[i] !== null)
            gl.enableVertexAttribArray(attribLocArray[i]);
    }
}
setAttribs.aLocArr= new Array();
function getCanvas(document)
{
    var canvas = document.getElementById("lerret");
    return canvas;
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
function setVector(vector,vecLoc)
{
    var lol = vector;
    var meh = vecLoc;
    gl.uniform3f(meh,lol[0],lol[1],lol[2]);
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
