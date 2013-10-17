function parseMtl(data, model,URL)
{
    var lines = data.split('\n');
    var texURL = fixUrl(URL);
    for(var i=0, index = -1; i<lines.length; i++)
    {
        if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]===('newmtl'))
        {
            index ++;
            var line = lines[i].slice(7);
            model.materialNames[index]= new Object()
            model.materialNames[index].name = line;
            model.materialInfo[model.materialNames[index].name]= new Object();
            model.materialInfo[model.materialNames[index].name].url = null;
        }
        else if(lines[i][0]+lines[i][1]==('Ka'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialInfo[model.materialNames[index].name].ambient = new Array();
            model.materialInfo[model.materialNames[index].name].ambient.push(line[0]); 
            model.materialInfo[model.materialNames[index].name].ambient.push(line[1]); 
            model.materialInfo[model.materialNames[index].name].ambient.push(line[2]); 
        }
        else if(lines[i][0]+lines[i][1]==('Kd'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialInfo[model.materialNames[index].name].diffuse = new Array();
            model.materialInfo[model.materialNames[index].name].diffuse.push(line[0]); 
            model.materialInfo[model.materialNames[index].name].diffuse.push(line[1]); 
            model.materialInfo[model.materialNames[index].name].diffuse.push(line[2]); 
        }
        else if(lines[i][0]+lines[i][1]==('Ks'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialNames[index].specular = vec3.fromValues(line[0],line[1],line[2]);
            model.materialInfo[model.materialNames[index].name].specular = new Array();
            model.materialInfo[model.materialNames[index].name].specular.push(line[0]); 
            model.materialInfo[model.materialNames[index].name].specular.push(line[1]); 
            model.materialInfo[model.materialNames[index].name].specular.push(line[2]); 
        }
        else if(lines[i][0]+lines[i][1]==('Ns'))
        {
            var line = lines[i].slice(3);
            model.materialInfo[model.materialNames[index].name].specularWeight = line;

        }
        else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]==('illum'))
        {
            var line = lines[i].slice(5);
            model.materialInfo[model.materialNames[index].name].illumModel = line;

        }
        else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]===('map_Kd'))
        {
            var line = lines[i].slice(7,lines[i].length);
            model.materialInfo[model.materialNames[index].name].url=texURL+line;
        }
    }
    function fixUrl(URL)
    {
        var urlSplit = URL.split('/');
        var texURL='';
        for(var i=0; i<urlSplit.length-1; i++)
        {
            texURL += urlSplit[i];
            texURL += '/';
        }
        return texURL;
    }
    return model;
}

function parseObj(obj,model)
{
    var lines = obj.split('\n');
    var vertexes = new Array();
    var normals = new Array();
    var textCord = new Array();
    var duplicateCheck ={}; 
    var index = 0; 
    var meshIndex = -1;
    var matIndex = -1;
    for(var i=0; i<lines.length; i++)
    {
        if(lines[i][0]+lines[i][1] === ('v '))
        {
            var line = lines[i].slice(2).split(' ');
            vertexes.push(line[0]);
            vertexes.push(line[1]);
            vertexes.push(line[2]);
        }
        else if(lines[i][0]+lines[i][1] === ('vn'))
        {
            var line = lines[i].slice(3).split(' ');
            normals.push(line[0]);
            normals.push(line[1]);
            normals.push(line[2]);
        }
        else if(lines[i][0]+lines[i][1] === ('vt'))
        {
            var line = lines[i].slice(3).split(' ');
            textCord.push(line[0]);
            textCord.push(line[1]);
        }
    }
    for(var i=0; i<lines.length; i++)
{
    if(lines[i][0]+lines[i][1] === ('f '))
    {
        var line = lines[i].slice(2).split(' ');
        for(var j=0; j<line.length; j++)
        {
            var indices = line[j].split('/');
            if(line[j] in duplicateCheck)
            {
                model.meshes[meshIndex].indexes.push(duplicateCheck[line [j] ]);
                model.materialIndex.push(model.indexedMaterialNames[matIndex]);
            }
            else
            {
                model.vertexes.push( vertexes[ (indices[0]-1)*3]);
                model.vertexes.push( vertexes[ (indices[0]-1)*3+1]);
                model.vertexes.push( vertexes[ (indices[0]-1)*3+2]);

                if(isNaN(textCord[(indices[1]-1)*2]))
                {
                    model.textCord.push(0.0);
                    model.textCord.push(0.0);
                }
                else
                {
                    model.textCord.push( textCord[ (indices[1]-1)*2  ]);
                    model.textCord.push( textCord[ (indices[1]-1)*2+1]);
                }
                if(isNaN(normals[ (indices[2]-1)*3 ]))
                {
                    model.normals= null;
                    alert('no normals in line: '+line[j]);
                }
                else
                {
                    model.normals.push( normals[    (indices[2]-1)*3  ]);
                    model.normals.push( normals[    (indices[2]-1)*3+1]);
                    model.normals.push( normals[    (indices[2]-1)*3+2]);
                }

                duplicateCheck[line[j]] = index;
                model.meshes[meshIndex].indexes.push(index);
                model.materialIndex.push(model.indexedMaterialNames[matIndex]);
                index++;
            }
        }
    }
    else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]=='usemtl')
    {
        if(!model.meshes[meshIndex])
            newMesh();
        var line = lines[i].slice(7);
        matIndex++;
        model.indexedMaterialNames[matIndex] = line;
        model.meshes[meshIndex].materialNames.push(line);
    }
    else if(lines[i][0]+lines[i][1] == 'o ')
        newMesh();
}
function newMesh()
{
    meshIndex++;
    model.meshes[meshIndex] = new MeshHolder();
}
return model;
}
var numTexturesLoaded=0;
var numTextures = 0;
function MeshHolder()
{
this.indexes = new Array();
this.materialNames = new Array();
}
function ModelHolder()
{
this.meshes = new Array();
this.materialNames = new Array();
this.materialInfo = new Array();
this.materialIndex = new Array();
this.indexedMaterialNames = new Array;
this.vertexes= new Array();
this.textCord= new Array();
this.normals = new Array();
this.diffuseArray = new Array();
this.ambientArray = new Array();
this.specularArray = new Array();
this.textures= new Array();
this.textureBuffers = new Array();
this.textureGLSLLocations = new Array();
this.generateDiffColor=function()
{
    var currentMat = 0;
    for(var i=0,k=0; i<this.materialIndex.length; i++,k+=3)
    {   
        if(this.materialIndex[i] === this.materialNames[currentMat].name)
            this.materialIndex[i] = currentMat;
        else
        {
            var j=0;
            while(this.materialIndex[i]!== this.materialNames[j].name)
                j++;
            currentMat = j;
        }
        var name = this.materialNames[currentMat].name;
        this.diffuseArray[k] = this.materialInfo[name].diffuse[0];
        this.diffuseArray[k+1] = this.materialInfo[name].diffuse[1];
        this.diffuseArray[k+2] = this.materialInfo[name].diffuse[2];

        this.ambientArray[k] = this.materialInfo[name].ambient[0];
        this.ambientArray[k+1] = this.materialInfo[name].ambient[1];
        this.ambientArray[k+2] = this.materialInfo[name].ambient[2];

        this.specularArray[k] = this.materialInfo[name].specular[0];
        this.specularArray[k+1] = this.materialInfo[name].specular[1];
        this.specularArray[k+2] = this.materialInfo[name].specular[2];
    }
}
    this.loadTextures=function(completionCallback,models,canvas)
    {
        for(var i=0; i<this.materialNames.length; i++)
        {
            if(this.materialInfo[this.materialNames[i].name].url=== null)
                continue;
            numTextures++;
            this.textures[this.materialNames[i].name] = new Image();
            this.textures[this.materialNames[i].name].src = this.materialInfo[this.materialNames[i].name].url;
            this.textures[this.materialNames[i].name].onload = (function() 
            {
                numTexturesLoaded++; 
                if(numTexturesLoaded == numTextures)
                    completionCallback(models,canvas);
            });
        }
    }
    this.generateTextureBuffers=function()
    {
        var mipMaps = true; 
        for(var i=0; i<this.materialNames.length; i++)
        {
            if(this.materialInfo[this.materialNames[i].name].url=== null)
                continue;
            gl.activeTexture(gl.TEXTURE0+i);
            var tBuffer=gl.createTexture();    
            gl.bindTexture(gl.TEXTURE_2D, tBuffer);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[this.materialNames[i].name]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipMaps > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            if(mipMaps)
                gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textureBuffers.push( tBuffer) ;
            for(var j=0; j<this.materialIndex.length; j++)
            {
                if(this.materialIndex[j] === this.materialNames[i].name)
                    this.materialIndex[j] = i;
            }
            this.textureGLSLLocations.push(i);
        }
        while(this.textureGLSLLocations.length<4)
            this.textureGLSLLocations.push(100); //100 so were sure materialIndex isnt mistakenly thinking it has a texture when it doesnt
        if(this.textureGLSLLocations.length>4)
            alert('max textures per mesh is set to 4, can easily be fixed');
        for(var j=0; j<this.materialIndex.length; j++)
        {
            if(this.materialIndex[j].isNaN)
                this.materialIndex = 200;
        }
    }
    this.generateBuffers=function()
    {
        this.generateDiffColor();
        this.generateTextureBuffers();
        return new iModel(this); 
    }
}

function iModel(bufferData)
{
    this.tB =               bufferData.textureBuffers;
    this.numMeshes=         bufferData.meshes.length;
    this.texGLSLlocs =      bufferData.textureGLSLLocations;
    this.vertexPoints =     bufferData.vertexes;
    this.vB=            gl.createBuffer();
    this.uvB =          gl.createBuffer();
    this.nB =           gl.createBuffer();
    this.diffColor =    gl.createBuffer();
    this.ambColor =     gl.createBuffer();
    this.specColor =    gl.createBuffer();
    this.matIndex =     gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( bufferData.textCord),gl.STATIC_DRAW);
    this.uvB.itemSize=2;
    this.uvB.numItems = bufferData.textCord.length/this.uvB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bufferData.vertexes),gl.STATIC_DRAW);
    this.vB.itemSize = 3;
    this.vB.numItems = bufferData.vertexes.length/this.vB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.nB);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bufferData.normals), gl.STATIC_DRAW);
    this.nB.itemSize = 3;
    this.nB.numItems = bufferData.normals.length/this.nB.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.diffColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData.diffuseArray),gl.STATIC_DRAW);
    this.diffColor.itemSize = 3;
    this.diffColor.numItems = bufferData.diffuseArray.length/this.diffColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ambColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData.ambientArray),gl.STATIC_DRAW);
    this.ambColor.itemSize = 3;
    this.ambColor.numItems = bufferData.ambientArray.length/this.ambColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.specColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData.specularArray),gl.STATIC_DRAW);
    this.specColor.itemSize = 3;
    this.specColor.numItems = bufferData.ambientArray.length/this.specColor.itemSize;

    gl.bindBuffer(gl.ARRAY_BUFFER,this.matIndex);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bufferData.materialIndex),gl.STATIC_DRAW);
    this.matIndex.itemSize = 1;

    this.iB = new Array();
    for(var i=0; i<this.numMeshes; i++)
    {
        this.iB[i] = gl.createBuffer();
    
   
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(bufferData.meshes[i].indexes),gl.STATIC_DRAW);
        this.iB[i].numItems = bufferData.meshes[i].indexes.length;
    }
}

function ObjLoader( nameAndURLs, completionCallback ,canvas)
{
    var ajaxes = new Array();
    var models = new Array();
    var names = new Array();
    $.each( nameAndURLs, function( name, URL )
    {
        names.push(name);
        var mtl = URL.slice(0,URL.length-3)+'mtl';
        models[name] = new ModelHolder();
        ajaxes.push($.ajax(
        {
                url: URL,
                dataType: 'text',
                success: function( data )
                {
                    parseObj( data ,models[name] );
                }
        }));
        ajaxes.push($.ajax(
        {
                url: mtl,
                dataType: 'text',
                success: function( data )
                {
                    parseMtl( data, models[name] ,URL);
                }
        }));
    });

    $.when.apply( $, ajaxes ).done(function(){
        loadTextures(models ,canvas,completionCallback ,names);
    });
}
function loadTextures(models,canvas,completionCallback,names)
{
    for(var i=0; i<names.length; i++)
        models[names[i]].loadTextures(completionCallback,models,canvas);
}
 
