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
function ObligHus(size)
{
    var vertexes = [ /*0*/-size,size,size,  /*1*/size,size,size,    /*2*/size,size,-size,     /*3*/-size,size,-size, /*top*/
                     /*4*/-size,-size,size, /*5*/size,-size,size,   /*6*/size,-size,-size,    /*7*/-size,-size,-size,/*bottom*/
                     /*8*/0.0,size*2.0,size,/*9*/0.0,size*2.0,-size, /*TAK*/
                     /*10*/-size,0.0,size,   /*11*/size*-0.25,0.0,size,/*12*/size*0.25,0.0,size,/*13*/size,0.0,size,/*DørÅpningTopp*/
                     /*14*/size*-0.25,-size,size, /*15*/size*0.25,-size,size];

    var indexes = [0,1,10,   10,13,1,/*overDøra*/
    10,4,11, 11,14,4,/*venstreSideAvDøra*/ 12,13,15, 15,5,13,/*høyreSideAvDøra*/
    1,5,0, 1,2,5, 5,6,2, 2,3,6, 6,7,3, 0,4,7,  3,7,0,/*sider*/
                    0,1,3,  1,2,3,/*topp*/ 4,5,6, 4,7,6];
                    var normals = new Array();
    while(normals.length<vertexes.length)
    {
        normals.push(vertexes[i]/size);
        i++;
    }
    var tulleUvs = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        tulleUvs.push(0.2);
        tulleUvs.push(0.2);
    }
    var diffColors = new Array();
    var specColors = new Array();
    var ambColors = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
       diffColors.push(1.0);
       diffColors.push(0);
       diffColors.push(0);

       specColors.push(1.0);
       specColors.push(0);
       specColors.push(0);
        var ambStrength = 0.1;
       ambColors.push(1.0*ambStrength);
       ambColors.push(0.0*ambStrength);
       ambColors.push(0.0*ambStrength);
    }
    var glslLocs = new Array();
    var matIndexes = new Array();
    while(glslLocs.length<4)
        glslLocs.push(100); 
    while(matIndexes.length<vertexes.length/3.0)
        matIndexes.push(50);
    this.tB =               0;
    this.numMeshes=         1;
    this.texGLSLlocs =      glslLocs;

    this.vB=            gl.createBuffer();
    this.uvB =          gl.createBuffer();
    this.nB =           gl.createBuffer();
    this.diffColor =    gl.createBuffer();
    this.ambColor =     gl.createBuffer();
    this.specColor =    gl.createBuffer();
    this.matIndex =     gl.createBuffer();
    this.vertexPoints = vertexes;
    this.iB = new Array();
    this.iB[0] =           gl.createBuffer();
    this.uvB = gl.createBuffer();
    this.vB =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( tulleUvs),gl.STATIC_DRAW);
    this.uvB.itemSize=2;
    this.uvB.numItems = tulleUvs.length/this.uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes),gl.STATIC_DRAW);
    this.vB.itemSize = 3;
    this.vB.numItems = vertexes.length/this.vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes), gl.STATIC_DRAW);
    this.nB.itemSize = 3;
    this.nB.numItems = normals.length/this.nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffColors),gl.STATIC_DRAW);
    this.diffColor.itemSize = 3;
    this.diffColor.numItems = diffColors.length/this.diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambColors),gl.STATIC_DRAW);
    this.ambColor.itemSize = 3;
    this.ambColor.numItems = ambColors.length/this.ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specColors),gl.STATIC_DRAW);
    this.specColor.itemSize = 3;
    this.specColor.numItems = ambColors.length/this.specColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.matIndex);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(matIndexes),gl.STATIC_DRAW);
    this.matIndex.itemSize = 1;
        
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[0]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexes),gl.STATIC_DRAW);
    this.iB[0].numItems = indexes.length;
}
function obligTriangleStrip(points, radius, runder)
{
    var wut = points;
    var vertexes = new Array();
    var x = -radius;
    var y = 0,z=0;
    var width = radius/runder;
    vertexes.push(x);
    vertexes.push(y);
    vertexes.push(z);
    var pluss = false;
    for(var i=0; i<wut; i++)
    {
        var x = pluss?width:-width;
        x+= -radius+(i/wut)*(radius*2);
        var xH = Math.cos((x/radius)*(Math.PI/2));
        var y = Math.sin((i/wut)*((Math.PI*2.0)*runder))*(radius*Math.sin((i/wut)*Math.PI))*xH;
        var z = Math.cos((i/wut)*((Math.PI*2.0)*runder))*(radius*Math.sin((i/wut)*Math.PI))*xH;
        vertexes.push(x);
        vertexes.push(y);
        vertexes.push(z);
        pluss = !pluss;
    }
    var normals = Array();
    var i=0;
    while(normals.length<vertexes.length)
    {
        normals.push(vertexes[i]/radius);
        i++;
    }
    var tulleUvs = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        tulleUvs.push(0.2);
        tulleUvs.push(0.2);
    }
    var diffColors = new Array();
    var specColors = new Array();
    var ambColors = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        var diversity = 8.0;
       diffColors.push(Math.random());
       diffColors.push(Math.random());
       diffColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);

       specColors.push(Math.random());
       specColors.push(Math.random());
       specColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);
        var ambStrength = 0.1;
       ambColors.push((Math.random())*ambStrength);
       ambColors.push((Math.random())*ambStrength);
       ambColors.push((Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5)*ambStrength);
    }
    var glslLocs = new Array();
    var matIndexes = new Array();
    while(glslLocs.length<4)
        glslLocs.push(100); 
    while(matIndexes.length<vertexes.length/3.0)
        matIndexes.push(50);
    this.tB =               0;
    this.numMeshes=         1;
    this.texGLSLlocs =      glslLocs;

this.strip = true;
    this.vB=            gl.createBuffer();
    this.uvB =          gl.createBuffer();
    this.nB =           gl.createBuffer();
    this.diffColor =    gl.createBuffer();
    this.ambColor =     gl.createBuffer();
    this.specColor =    gl.createBuffer();
    this.matIndex =     gl.createBuffer();
    this.vertexPoints = vertexes;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( tulleUvs),gl.STATIC_DRAW);
    this.uvB.itemSize=2;
    this.uvB.numItems = tulleUvs.length/this.uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes),gl.STATIC_DRAW);
    this.vB.itemSize = 3;
    this.vB.numItems = vertexes.length/this.vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes), gl.STATIC_DRAW);
    this.nB.itemSize = 3;
    this.nB.numItems = normals.length/this.nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffColors),gl.STATIC_DRAW);
    this.diffColor.itemSize = 3;
    this.diffColor.numItems = diffColors.length/this.diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambColors),gl.STATIC_DRAW);
    this.ambColor.itemSize = 3;
    this.ambColor.numItems = ambColors.length/this.ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specColors),gl.STATIC_DRAW);
    this.specColor.itemSize = 3;
    this.specColor.numItems = ambColors.length/this.specColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.matIndex);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(matIndexes),gl.STATIC_DRAW);
    this.matIndex.itemSize = 1;
        
      /*  this.iB = new Array();
        this.iB[0] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[0]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexes),gl.STATIC_DRAW);
    this.iB[0].numItems = indexes.length;*/
}
function ObligDor(size)
{
    var dThick = 16.0;
    var w = 4*1.2;
    var h = 2*1.2;
    var oY = (size-size/h)/2.0;
    var vertexes = [ /*0*/-size/w,size/h-oY,size/dThick,  /*1*/size/w,size/h-oY,size/dThick,    /*2*/size/w,size/h-oY,-size/dThick,     /*3*/-size/w,size/h-oY,-size/dThick,
                     /*4*/-size/w,-size/h-oY,size/dThick, /*5*/size/w,-size/h-oY,size/dThick,   /*6*/size/w,-size/h-oY,-size/dThick,    /*7*/-size/w,-size/h-oY,-size/dThick];
    var indexes = [0,4,5,    1,5,0, 1,2,5, 5,6,2, 2,3,6, 6,7,3, 0,4,7,  3,7,0,/*sider*/
                    0,1,3,  1,2,3,/*topp*/ 4,5,6, 4,7,6];
                    var normals = new Array();
    while(normals.length<vertexes.length)
    {
        normals.push(vertexes[i]/size);
        i++;
    }
    var tulleUvs = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        tulleUvs.push(0.2);
        tulleUvs.push(0.2);
    }
    var diffColors = new Array();
    var specColors = new Array();
    var ambColors = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        var diversity = 8.0;
       diffColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       diffColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       diffColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);

       specColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       specColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       specColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);
        var ambStrength = 0.1;
       ambColors.push((Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5)*ambStrength);
       ambColors.push((Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5)*ambStrength);
       ambColors.push((Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5)*ambStrength);
    }
    var glslLocs = new Array();
    var matIndexes = new Array();
    while(glslLocs.length<4)
        glslLocs.push(100); 
    while(matIndexes.length<vertexes.length/3.0)
        matIndexes.push(50);
    this.tB =               0;
    this.numMeshes=         1;
    this.texGLSLlocs =      glslLocs;

    this.vB=            gl.createBuffer();
    this.uvB =          gl.createBuffer();
    this.nB =           gl.createBuffer();
    this.diffColor =    gl.createBuffer();
    this.ambColor =     gl.createBuffer();
    this.specColor =    gl.createBuffer();
    this.matIndex =     gl.createBuffer();
    this.vertexPoints = vertexes;
    this.iB = new Array();
    this.iB[0] =           gl.createBuffer();
    this.uvB = gl.createBuffer();
    this.vB =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( tulleUvs),gl.STATIC_DRAW);
    this.uvB.itemSize=2;
    this.uvB.numItems = tulleUvs.length/this.uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes),gl.STATIC_DRAW);
    this.vB.itemSize = 3;
    this.vB.numItems = vertexes.length/this.vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes), gl.STATIC_DRAW);
    this.nB.itemSize = 3;
    this.nB.numItems = normals.length/this.nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffColors),gl.STATIC_DRAW);
    this.diffColor.itemSize = 3;
    this.diffColor.numItems = diffColors.length/this.diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambColors),gl.STATIC_DRAW);
    this.ambColor.itemSize = 3;
    this.ambColor.numItems = ambColors.length/this.ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specColors),gl.STATIC_DRAW);
    this.specColor.itemSize = 3;
    this.specColor.numItems = ambColors.length/this.specColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.matIndex);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(matIndexes),gl.STATIC_DRAW);
    this.matIndex.itemSize = 1;
        
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[0]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexes),gl.STATIC_DRAW);
    this.iB[0].numItems = indexes.length;
}
function ObligTerning(size)
{
    var vertexes = [ /*0*/-size,size,size,  /*1*/size,size,size,    /*2*/size,size,-size,     /*3*/-size,size,-size,
                     /*4*/-size,-size,size, /*5*/size,-size,size,   /*6*/size,-size,-size,    /*7*/-size,-size,-size];
    var indexes = [0,4,5,    1,5,0, 1,2,5, 5,6,2, 2,3,6, 6,7,3, 0,4,7,  3,7,0,/*sider*/
                    0,1,3,  1,2,3,/*topp*/ 4,5,6, 4,7,6];
                    var normals = new Array();
    while(normals.length<vertexes.length)
    {
        normals.push(vertexes[i]/size);
        i++;
    }
    var tulleUvs = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        tulleUvs.push(0.2);
        tulleUvs.push(0.2);
    }
    var diffColors = new Array();
    var specColors = new Array();
    var ambColors = new Array();
    for(var i=0.0; i<vertexes.length/3.0; i++)
    {
        var diversity = 8.0;
       diffColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       diffColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       diffColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);

       specColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       specColors.push(Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5);
       specColors.push(Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5);
        var ambStrength = 0.1;
       ambColors.push((Math.sin((i/vertexes.length)*Math.PI*diversity)/2.0+0.5)*ambStrength);
       ambColors.push((Math.cos((i/vertexes.length)*Math.PI*diversity)/2.0+0.5)*ambStrength);
       ambColors.push((Math.cos((i/vertexes.length)*Math.PI*diversity+Math.PI/diversity)/2.0+0.5)*ambStrength);
    }
    var glslLocs = new Array();
    var matIndexes = new Array();
    while(glslLocs.length<4)
        glslLocs.push(100); 
    while(matIndexes.length<vertexes.length/3.0)
        matIndexes.push(50);
    this.tB =               0;
    this.numMeshes=         1;
    this.texGLSLlocs =      glslLocs;

    this.vB=            gl.createBuffer();
    this.uvB =          gl.createBuffer();
    this.nB =           gl.createBuffer();
    this.diffColor =    gl.createBuffer();
    this.ambColor =     gl.createBuffer();
    this.specColor =    gl.createBuffer();
    this.matIndex =     gl.createBuffer();
    this.vertexPoints = vertexes;
    this.iB = new Array();
    this.iB[0] =           gl.createBuffer();
    this.uvB = gl.createBuffer();
    this.vB =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( tulleUvs),gl.STATIC_DRAW);
    this.uvB.itemSize=2;
    this.uvB.numItems = tulleUvs.length/this.uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes),gl.STATIC_DRAW);
    this.vB.itemSize = 3;
    this.vB.numItems = vertexes.length/this.vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes), gl.STATIC_DRAW);
    this.nB.itemSize = 3;
    this.nB.numItems = normals.length/this.nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffColors),gl.STATIC_DRAW);
    this.diffColor.itemSize = 3;
    this.diffColor.numItems = diffColors.length/this.diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambColors),gl.STATIC_DRAW);
    this.ambColor.itemSize = 3;
    this.ambColor.numItems = ambColors.length/this.ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specColors),gl.STATIC_DRAW);
    this.specColor.itemSize = 3;
    this.specColor.numItems = ambColors.length/this.specColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.matIndex);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(matIndexes),gl.STATIC_DRAW);
    this.matIndex.itemSize = 1;
        
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[0]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexes),gl.STATIC_DRAW);
    this.iB[0].numItems = indexes.length;
}
function computeNormal(Au, Bu, Cu)
{
    var A = vec3.fromValues(Au[0],Au[1],Au[2]);
    var B = vec3.fromValues(Bu[0],Bu[1],Bu[2]);
    var C = vec3.fromValues(Cu[0],Cu[1],Cu[2]);
    var AA = vec3.create();
    var BB = vec3.create();
    vec3.subtract(AA,A,B);
    vec3.subtract(BB,B,C);
    var n = vec3.create();
    vec3.cross(n,AA,BB); 
    vec3.normalize(n,n);
    return n;
}
