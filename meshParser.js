function parseMtl(data, model,URL)
{
    var urlSplit = URL.split('/');
    var texURL='';
    for(var i=0; i<urlSplit.length-1; i++)
    {
        texURL += urlSplit[i];
        texURL += '/';
    }
    var index=-1;
    var lines = data.split('\n');
    for(var i=0; i<lines.length; i++)
    {
        if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]===('newmtl'))
        {
            var line = lines[i].slice(7);
            model.materialNames.push(line);
            index ++;
        }
        else if(lines[i][0]+lines[i][1]==('Ka'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialNames[index].ambient = vec3.fromValues(line[0],line[1],line[2]);
        }
        else if(lines[i][0]+lines[i][1]==('Kd'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialNames[index].diffuse = vec3.fromValues(line[0],line[1],line[2]);
        }
        else if(lines[i][0]+lines[i][1]==('Ks'))
        {
            var line = lines[i].slice(3);
            line = line.split(' ');
            model.materialNames[index].specular = vec3.fromValues(line[0],line[1],line[2]);
        }
        else if(lines[i][0]+lines[i][1]==('Ns'))
        {
            var line = lines[i].slice(3);
            model.materialNames[index].ambientWeight = line;

        }
        else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]==('illum'))
        {
            var line = lines[i].slice(5);
            model.materialNames[index].illuminationModel = line;

        }
        else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]===('map_Kd'))
        {
            var line = lines[i].slice(7,lines[i].length);
            model.textureURLS[model.materialNames[index]]=texURL+line;
        }
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
        else if(lines[i][0]+lines[i][1] === ('f '))
        {
            var line = lines[i].slice(2).split(' ');
            for(var j=0; j<line.length; j++)
            {
                var indices = line[j].split('/');
                if(line[j] in duplicateCheck[meshIndex])
                    model.meshes[meshIndex].indexes.push(duplicateCheck[meshIndex][line [j] ]);
                else
                {
                    model.meshes[meshIndex].vertexes.push( vertexes[ (indices[0]-1)*3]);
                    model.meshes[meshIndex].vertexes.push( vertexes[ (indices[0]-1)*3+1]);
                    model.meshes[meshIndex].vertexes.push( vertexes[ (indices[0]-1)*3+2]);

                    model.meshes[meshIndex].textCord.push( textCord[ (indices[1]-1)*2  ]);
                    model.meshes[meshIndex].textCord.push( textCord[ (indices[1]-1)*2+1]);

                    model.meshes[meshIndex].normals.push( normals[    (indices[2]-1)*3  ]);
                    model.meshes[meshIndex].normals.push( normals[    (indices[2]-1)*3+1]);
                    model.meshes[meshIndex].normals.push( normals[    (indices[2]-1)*3+2]);

                    duplicateCheck[meshIndex][line[j]] = index;
                    model.meshes[meshIndex].indexes.push(index);
                    index++;
                }
            }
        }
        else if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]=='usemtl')
        {
            meshIndex++;
            var line = lines[i].slice(7);
            model.meshes[meshIndex] = new MeshHolder();
            model.meshes[meshIndex].materialName = line;
            duplicateCheck[meshIndex] = new Array();
            index=0;
        }
    }
    return model;
}

var numTexturesLoaded=0;
var numTextures = 0;
function MeshHolder()
{
    this.vertexes= new Array();
    this.textCord= new Array();
    this.normals = new Array();
    this.indexes = new Array();
    this.materialName;
}
function ModelHolder()
{
    this.meshes = new Array();
    this.materialNames = new Array();

    this.textureURLS= new Array();
    this.textures= new Array();
    this.textureBuffers = new Array();
    this.loadTextures=function(completionCallback,meshes,canvas)
    {
        for(var i=0; i<this.materialNames.length; i++)
        {
            numTextures++;
            this.textures[this.materialNames[i]] = new Image();
            this.textures[this.materialNames[i]].src = this.textureURLS[this.materialNames[i]];
            this.textures[this.materialNames[i]].onload = (function() 
            {
                numTexturesLoaded++; 
                if(numTexturesLoaded == numTextures)
                    completionCallback(meshes,canvas);
            });
        }
    }
    this.generateTextureBuffers=function()
    {
        for(var i=0; i<this.materialNames.length; i++)
        {
            var tBuffer=gl.createTexture();    
            gl.bindTexture(gl.TEXTURE_2D, tBuffer);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[this.materialNames[i]]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textureBuffers[this.materialNames[i]] = tBuffer;
            alert('START'+this.textureBuffers[ this.materialNames[i] ]+'END');;
        }
    }
    this.generateBuffers=function()
    {
        this.generateTextureBuffers();
        return new iModel(this.meshes,this.textureBuffers);
    }
}

function iModel(meshes,textureBuffers)
{
    this.tB = textureBuffers;
    this.numMeshes=meshes.length;
    this.vB = new Array();
    this.iB = new Array();
    this.uvB = new Array();
    this.mNames= new Array();
    for(var i=0; i<meshes.length; i++)
    {
        this.mNames[i] = meshes[i].materialName;
        this.vB[i] = gl.createBuffer();
        this.iB[i] = gl.createBuffer();
        this.uvB[i] = gl.createBuffer();
            
        gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB[i])
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( meshes[i].textCord),gl.STATIC_DRAW);
        this.uvB[i].itemSize=2;
        this.uvB[i].numItems = meshes[i].textCord.length/this.uvB[i].itemSize;

        gl.bindBuffer(gl.ARRAY_BUFFER,this.vB[i]);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(meshes[i].vertexes),gl.STATIC_DRAW);
        this.vB[i].itemSize = 3;
        this.vB[i].numItems = meshes[i].vertexes.length/this.vB[i].itemSize;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(meshes[i].indexes),gl.STATIC_DRAW);
        this.iB[i].numItems = meshes[i].indexes.length;
    }
}

function ObjLoader( nameAndURLs, completionCallback ,canvas)
{
    var ajaxes = new Array();
    var meshes = new Array();
    var names = new Array();
    $.each( nameAndURLs, function( name, URL )
    {
        names.push(name);
        var mtl = URL.slice(0,URL.length-3)+'mtl';
        meshes[name] = new ModelHolder();
        ajaxes.push($.ajax(
        {
                url: URL,
                dataType: 'text',
                success: function( data )
                {
                    parseObj( data ,meshes[name] );
                }
        }));
        ajaxes.push($.ajax(
        {
                url: mtl,
                dataType: 'text',
                success: function( data )
                {
                    parseMtl( data, meshes[name] ,URL);
                }
        }));
    });

    $.when.apply( $, ajaxes ).done(function(){
        loadTextures(meshes ,canvas,completionCallback ,names);
    });
}
function loadTextures(meshes,canvas,completionCallback,names)
{
    for(var i=0; i<names.length; i++)
    {
        meshes[names[i]].loadTextures(completionCallback,meshes,canvas);
    }
}
 
