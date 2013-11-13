function Explosion(drawObjects, product,shaderProgram,pos,numParticles,scale)
{
    var particles = new Array();
    var cPos = pos;
    var num = numParticles;
    var scaleX = scale[0];
    var scaleY = scale[1];
    var scaleZ = scale[2];
    var totalNum = 0;
    var time = 0;
    var maxSpeed = 0.1;
    var maxMaxDistance = 0.5
    function init(drawObjects,product,shaderProgram)
    {
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[totalNum]= new rObject(drawObjects,product,shaderProgram,cPos);
                    particles[totalNum].setHidden(true);
                    totalNum ++;
                }
            }
        }

        console.log(totalNum);
    }
    alive = false;
    function wake()
    {
        var i=0;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[i].global.setHidden(false);
                    i ++;
                }
            }
        }
        alive = true;
        time = 0;
    }
    function die()
    {
        var i=0;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[i].setHidden(true);
                    particles[i].global.setPosition(cPos);
                    i ++;
                }
            }
        }
        alive = false;
    }
    function updateParticles(cameraPosition,dt)
    {
        time += dt;
        var i=0;
        var startValue = time/Number.MAX_VALUE;
        var heavyDecreaser = (startValue+1.0)*Number.MIN_VALUE;
        var heavyIncreaser = Math.pow(2,startValue);
        var increaser = Math.pow(heavyIncreaser,heavyDecreaser);
        var moveScale = increaser<maxSpeed?increaser:maxSpeed;
        var maxValue = vec3.fromValues

        var maxDistance = time<maxMaxDistance?time:maxMaxDistance;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    var particlePos = particles[i].global.getPos();

                    var axis= vec3.create();
                    vec3.cross(axis,cameraPosition, particlePos);
                    vec3.normalize(axis,axis);
                    var dot = vec3.dot(vec3.normalize(vec3.create(),particlePos),vec3.normalize(vec3.create(),cameraPosition));
                    var ang = Math.acos(dot);
                    var pRot=quat.create();
                    quat.setAxisAngle(pRot,axis, ang);

                    particles[i].global.setRotation(pRot);


                    var add = num+time;
                    var xMod = simplex.noise(z+add, y+add)*moveScale;
                    var yMod = simplex.noise(x+add, z+add)*moveScale;
                    var zMod = simplex.noise(y+add, x+add)*moveScale;
                    var mov = vec3.fromValues(xMod,yMod,zMod);
                    var absPos = vec3.create();
                    vec3.add(absPos,particlePos,mov)

                    if(vec3.distance(absPos,cPos)<maxDistance)
                        particles[i].global.translate(mov);

                    i++;
                }
            }
        }
    }
    this.update = function(cameraPosition, dt)
    {
        if(alive)
            updateParticles(cameraPosition,dt);

    }
    init(drawObjects,product,shaderProgram);
}
function ParticleIndexed(product,shaderProgram)
{
    this.pos    = vec3.create();
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0, 1.0, 1.0);
    this.vertexBuffer   =   product.vB;  
    this.colorBuffer    =   product.cB;
    this.indexBuffer    =   product.iB;
    this.vPosLoc = shaderProgram.vPos;
    this.vColLoc = shaderProgram.vCol;
    this.mMatLoc = shaderProgram.mMat;
    this.shader  = shaderProgram.shader;
    this.draw = function() 
	{
        setShader(this.shader);
        setMatrixPRS(this.pos,this.rot,this.scale,this.mMatLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vPosLoc, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.vColLoc, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
    this.draw = function() 
	{
        setShader(this.shader.shader);
        setMatrix(this.global.calcMatrix(),this.shader.mMat);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vB);
        gl.vertexAttribPointer(this.shader.vPos, this.model.vB.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.model.uvB);
        gl.vertexAttribPointer(this.shader.uvMap,   this.model.uvB.itemSize,     gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.nB);
        gl.vertexAttribPointer(this.shader.normals, this.model.nB.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.diffColor);
        gl.vertexAttribPointer(this.shader.diffColor, this.model.diffColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.ambColor);
        gl.vertexAttribPointer(this.shader.ambColor, this.model.ambColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.specColor);
        gl.vertexAttribPointer(this.shader.specColor, this.model.specColor.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.matIndex)
        gl.vertexAttribPointer(this.shader.materialIndex, this.model.matIndex.itemSize, gl.FLOAT, false , 0,0);

        gl.uniform1iv(this.shader.samplerCount, this.model.texGLSLlocs );
        for(var j=0; j<this.model.tB.length; j++)
        {
            activateTexture(gl.TEXTURE0+j,this.model.tB[j],this.shader.texSamplers,j);
        }
        for(var i=0; i<this.model.numMeshes; i++)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
            gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
        }
       // debugDraw.global.setPosition(this.global.getPos());
       // debugDraw.draw();
	}
    drawObjects.add(this);
}
function ParticleNoIndex(product, shaderProgram)
{
    this.pos    = vec3.create();
    this.rot    = quat.create();
    this.scale  = vec3.fromValues(1.0, 1.0, 1.0);
    this.vertexBuffer   =product.vB;
    this.colorBuffer    =product.cB;
    this.vPosLoc = shaderProgram.vPos;
    this.vColLoc = shaderProgram.vCol;
    this.mMatLoc = shaderProgram.mMat;
    this.shader  = shaderProgram.shader;
    this.scalePt= function(value)
    {
        this.scale = vec3.fromValues(value,value,value);
    }
    this.draw = function() 
	{
        setShader(this.shader);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vPosLoc, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.vColLoc, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixPRS(this.pos,this.rot,this.scale,this.mMatLoc);
		gl.drawArrays(gl.TRIANGLES , 0, this.vertexBuffer.numItems);
	}
}
