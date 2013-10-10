function parseMtl(data, model,URL)
{
    var urlSplit = URL.split('/');
    var texURL='';
    for(var i=0; i<urlSplit.length-1; i++)
    {
        texURL += urlSplit[i];
        texURL += '/';
    }
    var lines = data.split('\n');
    for(var i=0; i<lines.length; i++)
    {
        if(lines[i][0]+lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]===('map_Kd'))
        {
            var line = lines[i].slice(7,lines[i].length);
            model.textureURLS.push(texURL+line);
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
                if(line[j] in duplicateCheck)
                    model.indexes.push(duplicateCheck[line [j] ]);
                else
                {
                    model.vertexes.push( vertexes[ (indices[0]-1)*3]);
                    model.vertexes.push( vertexes[ (indices[0]-1)*3+1]);
                    model.vertexes.push( vertexes[ (indices[0]-1)*3+2]);

                    model.textCord.push( textCord[ (indices[1]-1)*2  ]);
                    model.textCord.push( textCord[ (indices[1]-1)*2+1]);

                    model.normals.push( normals[    (indices[2]-1)*3  ]);
                    model.normals.push( normals[    (indices[2]-1)*3+1]);
                    model.normals.push( normals[    (indices[2]-1)*3+2]);

                    duplicateCheck[line[j]] = index;
                    model.indexes.push(index);
                    index++;
                }
            }
        }
    }
    return model;
}

var numTexturesLoaded=0;
var numTextures = 0;
function ModelHolder()
{
    this.vertexes= new Array();
    this.vertexIndexes= new Array();
    this.textCord= new Array();
    this.normals = new Array();
    this.indexes = new Array();
    this.textureURLS= new Array();
    this.textures= new Array();
    this.textureBuffers = new Array();
    this.loadTextures=function(completionCallback,meshes,canvas)
    {
        for(var i=0; i<this.textureURLS.length; i++)
        {
            numTextures++;
            this.textures[i] = new Image();
            this.textures[i].src = this.textureURLS[i];
            this.textures[i].onload = (function() 
            {
                numTexturesLoaded++; 
                if(numTexturesLoaded == numTextures)
                    completionCallback(meshes,canvas);
            });
        }
    }
    this.generateTextureBuffers=function()
    {
        for(var i=0; i<this.textureURLS.length; i++)
        {
            var texLoc=gl.createTexture();    
            gl.bindTexture(gl.TEXTURE_2D, texLoc);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[i]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.textureBuffers[i] = texLoc;
        }
    }
    this.generateBuffers=function()
    {
        this.generateTextureBuffers();
        return new iModel(this.vertexes,this.textCord,this.indexes,this.textureBuffers);
    }
}

function iModel(vertexes,uvMap,indexes,texbfrs)
{
    this.textureBuffers = texbfrs;
    this.vB = gl.createBuffer();
    this.iB = gl.createBuffer();
    this.uvB = gl.createBuffer();
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,this.uvB)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array( uvMap),gl.STATIC_DRAW);
        this.uvB.itemSize=2;
        this.uvB.numItems = uvMap.length/this.uvB.itemSize;
    }
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vB);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexes),gl.STATIC_DRAW);
        this.vB.itemSize = 3;
        this.vB.numItems = vertexes.length/this.vB.itemSize;
    }
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iB);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexes),gl.STATIC_DRAW);
        this.iB.numItems = indexes.length;
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
 
