function parseObj(obj)
{
    var lines = obj.split('\n');
    var model = new ModelHolder();
    for(var i=0; i<lines.length; i++)
    {
        if(lines[i][0]+lines[i][1] === ('v '))
        {
            var line = lines[i].slice(2).split(' ');
            model.vertexes.push(line[0]);
            model.vertexes.push(line[1]);
            model.vertexes.push(line[2]);
        }
        if(lines[i][0]+lines[i][1] === ('vn'))
        {
            var line = lines[i].slice(3).split(' ');
            model.normals.push(line[0]);
            model.normals.push(line[1])
            model.normals.push(line[2])
        }
        if(lines[i][0]+lines[i][1] === ('vt'))
        {
            var line = lines[i].slice(3).split(' ');
            model.textCord.push(line[0]);
            model.textCord.push(line[1])
        }
        if(lines[i][0]+lines[i][1] === ('f '))
        {
            var line = lines[i].slice(2).split(' ');
            for(var j=0; j<3; j++)
            {
                var uints = line[j].split('/');
                model.vertexIndexes.push(uints[0]-1);
                model.uvIndexes.push(uints[1]-1);
                model.normalIndexes.push(uints[2]-1);
            }
        }
    }
    return model;
}
function ModelHolder()
{
    this.vertexes= new Array();
    this.vertexIndexes= new Array();
    this.uvIndexes = new Array();
    this.normalIndexes = new Array();
    this.normals= new Array();
    this.textCord= new Array();
    this.colors= new Array();
    this.hasColors=false;
    this.generateColors=function(red,green,blue)
    {
        for(var i=0; i<this.vertexes.length/3.0; i++)
        {
            var r = red;
            var g = green;
            var b = blue;
            var a = 1.0;
            this.colors.push(r);
            this.colors.push(g);
            this.colors.push(b);
            this.colors.push(a);
        }
        this.hasColors=true;
    }
    this.generateBuffers=function()
    {
        if(this.hasColors===false)
            this.generateColors(0.5,0.5,0.5);
        return new iModel(this.vertexes,this.vertexIndexes,this.colors);
    }
}
function iModel(vertexes,indexes,colors)
{
    this.vB = gl.createBuffer();
    this.iB = gl.createBuffer();
    this.cB = gl.createBuffer();
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
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,this.cB);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
        this.cB.itemSize = 4;
        this.cB.numItems = colors.length/this.cB.itemSize;
    }
}
function ObjLoader( nameAndURLs, completionCallback ,canvas)
{
    var ajaxes = new Array();
    var meshes = new Array();
    $.each( nameAndURLs, function( name, URL )
    {
        ajaxes.push($.ajax(
        {
                url: URL,
                dataType: 'text',
                success: function( data )
                {
                    meshes[name] =  parseObj( data );
                }
        }));
    });

    $.when.apply( $, ajaxes ).done(function(){
        completionCallback( meshes ,canvas);
    });
}

 
