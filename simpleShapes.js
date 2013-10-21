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
