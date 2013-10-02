function triangle()
{
    this.vB = gl.createBuffer();
    this.cB = gl.createBuffer();
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vB);
        var vertices = [
			 -1.0, 	-1.0, 	0.0,
			 1.0, 	-1.0,  	0.0,
			 0.0, 	1.0, 	0.0,
         ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vB.itemSize = 3;
        vB.numItems = 3;
    }
    {
       gl.bindBuffer(gl.ARRAY_BUFFER, cB);
       var colors = [
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
       ];
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
       cB.itemSize = 4;
       cB.numItems = 3;
    }
    return this;
}
function iSquare()
{
    this.vB = gl.createBuffer();
    this.cB = gl.createBuffer();
    this.iB = gl.createBuffer();
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vB);
        var vertices = [
			 -1.0, 	-1.0, 	0.0,
			 1.0, 	-1.0,  	0.0,
			 1.0, 	1.0, 	0.0,
            -1.0,   1.0,    0.0,
         ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vB.itemSize = 3;
        vB.numItems = 4;
    }
    {
       gl.bindBuffer(gl.ARRAY_BUFFER, cB);
       var colors = [
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
       ];
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
       cB.itemSize = 4;
       cB.numItems = 4;
   }
   {
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iB);
       var indexes = [
       0,1,2, 3,0,2
       ];
       gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes),gl.STATIC_DRAW);
       iB.numItems = 6;
   }
   return this;
}
