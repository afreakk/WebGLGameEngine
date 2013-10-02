/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }

  return program;
}
// our shaders base path
loadShaders.base = "shader/";

// our shaders loader
function loadShaders(gl, shaders, callback) {
    // (C) WebReflection - Mit Style License
    function onreadystatechange() 
    {
        var xhr = this, i = xhr.i;
        if (xhr.readyState == 4) 
        {
            shaders[i] = gl.createShader
            (
                shaders[i].slice(0, 2) == "fs" ?
                    gl.FRAGMENT_SHADER :
                    gl.VERTEX_SHADER
            );
            gl.shaderSource(shaders[i], xhr.responseText);
            gl.compileShader(shaders[i]);
            if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS))
                throw gl.getShaderInfoLog(shaders[i]);
            !--length && typeof callback == "function" && callback(shaders);
        }
    }
    for (var shaders = [].concat(shaders), asynchronous = !!callback, i = shaders.length, length = i, xhr; i--;) 
    {
        (xhr = new XMLHttpRequest).i = i;
        xhr.open("get", loadShaders.base + shaders[i] + ".c", asynchronous);
        if (asynchronous) 
        {
            xhr.onreadystatechange = onreadystatechange;
        }
        xhr.send(null);
        onreadystatechange.call(xhr);
    }
    return shaders;
}
function getShader(gl, vs, fs)
{
   var shaders = loadShaders(gl, [vs, fs]); 
   return createProgram(gl,shaders[0],shaders[1]);
}
