
function baseBind(model,shader)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vB);
    gl.vertexAttribPointer(shader.vPos, model.vB.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER,model.uvB);
    gl.vertexAttribPointer(shader.uvMap,   model.uvB.itemSize,     gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.nB);
    gl.vertexAttribPointer(shader.normals, model.nB.itemSize, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.diffColor);
    gl.vertexAttribPointer(shader.diffColor, model.diffColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.ambColor);
    gl.vertexAttribPointer(shader.ambColor, model.ambColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.specColor);
    gl.vertexAttribPointer(shader.specColor, model.specColor.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.matIndex)
    gl.vertexAttribPointer(shader.materialIndex, model.matIndex.itemSize, gl.FLOAT, false , 0,0);
}
var strikeCount = 0;
function gui3DElement(drawObjects, product, shaderProgram, pos)
{
    this.global = new Translations();
    this.global.translate(pos);
    this.model = product;
    this.shader  = shaderProgram;
    this.alpha = -1; // -1 = full alpha
    var guiTextures = new Array();
    var textureBuffers = new Array();
    var currentTexture = null;
    var drawSecond = true;
    this.draw = function() 
	{
        if(isHidden===true)
            return;
        setShader(this.shader.shader);
        setMatrix(this.global.calcMatrix(),this.shader.mMat);
        baseBind(this.model,this.shader);
        if(currentTexture !== null)
            activateTexture(gl.TEXTURE0,textureBuffers[currentTexture],this.shader.texSamplers,0);

        if(this.alpha != -1)
            gl.uniform1f(this.shader.alpha, this.alpha );
        if(drawSecond===true)
        {
            var dist = 0.04;
            this.global.translate(vec3.fromValues(0,0,dist));
            gl.uniform1i(this.shader.strike, 50 );
            setMatrix(this.global.calcMatrix(),this.shader.mMat);
            for(var i=0; i<this.model.numMeshes; i++)
            {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
                gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
            }
            gl.uniform1i(this.shader.strike, strikeCount );
            this.global.translate(vec3.fromValues(-0,-0,-dist));
            setMatrix(this.global.calcMatrix(),this.shader.mMat);
        }
        for(var i=0; i<this.model.numMeshes; i++)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
            gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
        }
        if(this.alpha != -1)
            gl.uniform1f(this.shader.alpha, 1.0  ); //revert back to normal
	}
    this.getCurrentTexture=function()
    {
        return currentTexture;
    }
    this.getTexture=function()
    {
        return currentTexture;
    }
    this.useTexture=function(url)
    {
        currentTexture = url;
        if(url in textureBuffers)
        {
            return;
        }
        else
        {
            loadTextures(url,generateTextureBuffers);
        }
    }
    this.setTexture=function(url)
    {
        currentTexture = url;
        if(url in textureBuffers)
        {
            return;
        }
        else
        {
            loadTextures(url,generateTextureBuffers);
        }
    }
    this.setText=function(text,ActualString)
    {
        if(text in textureBuffers)
        {
            currentTexture = text;
            return;
        }
        textureBuffers[text] = textToTexture(text,ActualString);
        currentTexture = text;

    }
    function loadTextures(url, completionCallback)
    {
        guiTextures[url] = new Image();
        guiTextures[url].src = "imgz/"+url;
        guiTextures[url].onload = (function() 
        {
            completionCallback(guiTextures[url],url);
        });
    }
    function generateTextureBuffers(inImg, url)
    {
        var mipMaps = false; 
        gl.activeTexture(gl.TEXTURE0);
        var tBuffer=gl.createTexture();    
        gl.bindTexture(gl.TEXTURE_2D, tBuffer);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inImg);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipMaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        if(mipMaps)
            gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        textureBuffers[url] = tBuffer;
        currentTexture = url;
    }
    var drawIndex = drawObjects.add(this);
    var drawObjs = drawObjects;
    var isHidden = false;
    this.getHidden=function()
    {
        return isHidden;
    }
    this.setHidden = function(hidden)
    {
        isHidden = hidden;
    }
}
var haxStrike = false;
function rObject(drawObjects, product,shaderProgram,pos)
{
    this.global = new Translations();
    this.global.translate(pos);
    this.model = product;
    this.shader  = shaderProgram;
    this.alpha = -1;
    this.draw = function() 
	{
        if(haxStrike)
            gl.uniform1i(this.shader.strike, 0 );
        if(this.alpha != -1)
            gl.uniform1f(this.shader.alpha, this.alpha );
        setShader(this.shader.shader);
        setMatrix(this.global.calcMatrix(),this.shader.mMat);
        baseBind(this.model,this.shader);
        for(var j=0; j<this.model.tB.length; j++)
        {
            activateTexture(gl.TEXTURE0+j,this.model.tB[j],this.shader.texSamplers,j);
        }
        for(var i=0; i<this.model.numMeshes; i++)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
            gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
        }
        if(this.alpha != -1)
            gl.uniform1f(this.shader.alpha, 1.0  ); //revert back to normal
       // debugDraw.global.setPosition(this.global.getPos());
       // debugDraw.draw();
        if(haxStrike)
            gl.uniform1i(this.shader.strike, 1 );
	}
    var drawIndex = drawObjects.add(this);
    var drawObjs = drawObjects;
    this.isHidden = false;
    this.setHidden = function(hidden)
    {
        if( hidden===false && this.isHidden!=hidden )
        {
            drawObjs.show(drawIndex,this);
            this.isHidden = false;
        }
        else if(hidden ===true && this.isHidden!=hidden )
        {
            drawObjs.hide(drawIndex);
            this.isHidden = true;
        }
    }
}
function gObject(drawObjects, product,shaderProgram,pos,mass,shape)
{
    this.global = new Translations();
    this.global.translate(pos);
    this.model = product;
    this.shader  = shaderProgram;
    this.rigidBody = null;
    this.ghost = null;
    if(shape === "triMesh")
        this.rigidBody = pWorld.addBodyTri(mass, pos, product);
    else if(shape == "ghost")
        this.ghost = pWorld.addGhost(pos ,product.vertexPoints);
    else if(shape)
        this.rigidBody = pWorld.addBodyHasShape(mass,pos,shape);
    else
        this.rigidBody = pWorld.addBodyConvex(mass,pos,product.vertexPoints); 
    if(this.rigidBody)
        var motionState = this.rigidBody.getMotionState();
    else
    {
        var btPos = new Ammo.btVector3(this.global.pos[0],this.global.pos[1],this.global.pos[2]);
        var btQuat = new Ammo.btQuaternion(this.global.rot[0],this.global.rot[1],this.global.rot[2],this.global.rot[3]);
    }
    var transform = new Ammo.btTransform();
    this.draw = function() 
	{
        if(this.rigidBody)
        {
            transform = this.rigidBody.getCenterOfMassTransform();
            this.global.physicsUpdate(transform);
        }
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
    this.updateGhost= function()
    {
        btPos.setX(this.global.pos[0]);
        btPos.setY(this.global.pos[1]);
        btPos.setZ(this.global.pos[2]);
        btQuat.setX(this.global.rot[0]);
        btQuat.setY(this.global.rot[1]);
        btQuat.setZ(this.global.rot[2]);
        btQuat.setW(this.global.rot[3]);
        transform.setOrigin(btPos);
        transform.setRotation(btPos);
        this.ghost.setWorldTransform(transform);
    }
    var drawIndex = drawObjects.add(this);
    var drawObjs = drawObjects;
    var isHidden = false;
    this.setHidden = function(hidden)
    {
        if( !hidden && isHidden!=hidden )
        {
            drawObjs.add(this);
            isHidden = false;
        }
        else if(hidden && isHidden!=hidden )
        {
            drawObjs.hide(drawIndex);
            isHidden = true;
        }
    }
    this.remove=function()
    {
        this.setHidden(true);
        pWorld.remove(this);
    }
    
}
function activateTexture(texturecount,texture,textureSamplers, index)
{
    gl.activeTexture(texturecount);
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(textureSamplers[index],index);
}
function Translations()
{
    this.pos = vec3.create();
    this.rot = quat.create();
    var tPos;
    var tRot;
    this.physicsUpdate= function(transform)
    {
        tPos = transform.getOrigin();
        this.pos = vec3.fromValues(tPos.x(),tPos.y(),tPos.z());

        tRot = transform.getRotation();
        this.rot = quat.fromValues(tRot.x(),tRot.y(),tRot.z(),tRot.w());
    }
    this.translate = function(trans)
    {
        vec3.add(this.pos,this.pos,trans);
    }
    this.setPosition = function(pos)
    {
        this.pos = vec3.fromValues(pos[0], pos[1], pos[2]);
    }
    this.rotate = function(q)
    {
        quat.multiply(this.rot,this.rot,q);
    }
    this.setRotation = function(q)
    {
        this.rot = quat.fromValues(q[0],q[1],q[2],q[3]);
    }
    this.lookAt = function(vec)
    {
        var nVec = vec3.create();
        var nPos = vec3.create();
        vec3.normalize(nVec,vec);
        vec3.normalize(nPos,this.pos);
        this.rot = quat.rotationTo(this.rot,nVec,nPos);
    }
    this.calcMatrix = function()
    {
        var cMatrix = mat4.create();
        if(!offset)
            mat4.fromRotationTranslation(cMatrix,this.rot,this.pos);
        else
        {
            var offPos = vec3.create();
            vec3.add(offPos,this.pos,this.posOffset);
            mat4.fromRotationTranslation(cMatrix,this.rot,offPos);
        }
        return cMatrix;
    }
    var offset = false;
    this.posOffset;
    this.setPosOffset=function(vec)
    {
        this.posOffset = vec;
        offset = true;
    }
    this.getPos = function()
    {
        return this.pos;
    }
    this.getRot = function()
    {
        return this.rot;
    }
}
var debugDraw;
function DebugDraw(drawObjects, product,shaderProgram,pos)
{
    this.global = new Translations();
    this.global.translate(pos);
    this.model = product;
    this.shader  = shaderProgram;
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
            activateTexture(gl.TEXTURE0+j,this.model.tB[j],this.shader.texSamplers,j);
        for(var i=0; i<this.model.numMeshes; i++)
        {
            if(this.model.strip)
            {
                gl.drawArrays(gl.TRIANGLE_STRIP,0,this.model.vB.numItems);
            }
            else
            {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.iB[i]);
                gl.drawElements(gl.TRIANGLES, this.model.iB[i].numItems, gl.UNSIGNED_SHORT, 0);
            }
        }
	}
    drawObjects.add(this);
    
}
