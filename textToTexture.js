
function textToTexture(stringToWrite, ActualString)
{
    var workCanvas = document.getElementById("textureCanvas");
    var ctx = workCanvas.getContext('2d');
    // Omitted: helper functions
                
    var text = [];
    var textX, textY;
    var textToWrite = stringToWrite; 
    var textHeight = 32;
    var maxWidth = 128;
    var canvasTexture;
    var actualString = ActualString;
    // Omitted: Set up the canvas and get the context
    function makeCanvasText()
    {

        ctx.font = textHeight+"px monospace";
        var canvasX,canvasY;
        if(actualString !== true)
        {
            maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
            canvasX = getPowerOfTwo(maxWidth);
            canvasY = getPowerOfTwo(textHeight*(text.length+1));
        }
        else
        {
            text = textToWrite;
            canvasX = 512;
            canvasY = 512;
        }
        workCanvas.width = canvasX;
        workCanvas.height = canvasY;

        // Omitted: Set canvas width / height 
        // Omitted: Set text properties

        textX = canvasX/2;
        var offset = (canvasY - textHeight*(text.length+1)) * 0.5;

        if(actualString !== true)
        {
            for(var i = 0; i < text.length; i++) {
                textY = (i+1)*(textHeight*0.5) + offset*0.5;
                ctx.fillText(text[i], textX,  textY+20.0);
            }
        }
        else
        {
            for(var i = 0; i < text.length; i++) {
                textY = (i+1)*(textHeight*0.2) + offset*0.2;
                ctx.fillText(text[i], textY+100,  textX+20.0);
            }
        }
    }

    function handleLoadedTexture() 
    {
        canvasTexture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas')); 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);

    }
    makeCanvasText();
    handleLoadedTexture();
    return canvasTexture;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) 
{
    textToWrite = textToWrite.replace("\n"," ");
    var currentText = textToWrite;
    var futureText;
    var subWidth = 0;
    var maxLineWidth = 0;
    
    var wordArray = textToWrite.split(" ");
    var wordsInCurrent, wordArrayLength;
    wordsInCurrent = wordArrayLength = wordArray.length;
    
    // Reduce currentText until it is less than maxWidth or is a single word
    // futureText var keeps track of text not yet written to a text line
    while (ctx.measureText(currentText).width > maxWidth && wordsInCurrent > 1) {
        wordsInCurrent--;
        var linebreak = false;
        
        currentText = futureText = "";
        for(var i = 0; i < wordArrayLength; i++) {
            if (i < wordsInCurrent) {
                currentText += wordArray[i];
                if (i+1 < wordsInCurrent) { currentText += " "; }
            }
            else {
                futureText += wordArray[i];
                if(i+1 < wordArrayLength) { futureText += " "; }
            }
        }
    }
    text.push(currentText); // Write this line of text to the array
    maxLineWidth = ctx.measureText(currentText).width;
    
    // If there is any text left to be written call the function again
    if(futureText) {
        subWidth = createMultilineText(ctx, futureText, maxWidth, text);
        if (subWidth > maxLineWidth) { 
            maxLineWidth = subWidth;
        }
    }
    
    // Return the maximum line width
    return maxLineWidth;
}

function getPowerOfTwo(val, pow) {
	var pow = (pow === undefined)?1:pow;
	while(pow<val) {
		pow *= 2;
	}
	return pow;
}
