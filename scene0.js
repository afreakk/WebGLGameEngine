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
        shaderStruct = new getShaderLocations(shader);
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
        var cam = new Camera(cPos,cLookAt,shaderStruct.vMat); 

        var pos1 = vec3.fromValues(-2.5,0.0,-10.0);
        var tri = new triangle();
        obj0 = new ParticleNoIndex(tri,shaderStruct);
        obj0.pos = pos1;
        obj0.draw();
        
        var pos2 = vec3.fromValues(2.0,0.0,-10.0);
        obj1 = new ParticleIndexed(new iSquare(), shaderStruct);
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
}

function SceneTwo()
{
    this.endScene=false;
    this.nextLvl=0;
    this.init = function()
    {
        alert("SceneTwo not implemented");
    }
    this.update = function()
    {
        console.error("sceneTwo update");
    }
}
