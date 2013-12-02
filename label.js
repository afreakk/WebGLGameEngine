RGBToHex = function(r,g,b){
    var bin = r << 16 | g << 8 | b;
    return (function(h){
        return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
}
var multicrew = (multicrew || {});

if(!Math.clamp) Math.clamp = function(val, min, max) { return Math.max(min, Math.min(val, max)); }

multicrew.Label = function(options)
{
	var options = (options || {});
	
	this.parent		= null;
	this.title		= (options.title || false);
	this.text		= (options.text || "Label");
	this.lastText	= "";
	this.color		= (options.color || "#FFF");
    this.titleColor = (options.titleColor || this.color);
	this.font		= (options.font || "15px monospace");
	this.width		= 0;
	this.height		= 0;
	this.x 			= (options.x || 0);
	this.y			= (options.y || 0);
    this.crazyMode  = false;
    this.db         = 0;
}

multicrew.Label.prototype.init = function()
{
	if(this.parent && this.parent.canvas)
	{
		this.width		= Number(this.parent.context.measureText(this.text).width);
		this.height		= Number(this.parent.context.font.replace(/px[^0-9]*$/, ""));
		this.lastText	= this.text;
	}
}

multicrew.Label.prototype.draw = function()
{
    var scaleW = panelCanvas.width/startingInnerWidth;
    var scaleH = panelCanvas.height/startingInnerHeight;
	if(!this.parent.canvas)
		return;
	
	if(this.text != this.lastText)
    {
		this.init();
    }
    if(this.crazyMode === true)
    {
        if(Math.random()>0.5)
        {
            var r = Math.random()*this.db*255;
            var g = Math.random()*this.db*255;
            var b = Math.random()*this.db*255;

            this.color = RGBToHex(r.clamp(0,255),g.clamp(0,255),b.clamp(0,255));
        }
    }
	var style = this.parent.context.fillStyle;
	this.parent.context.clearRect(this.x*(scaleW), (this.y)*(scaleH) - this.height*scaleH, this.width*scaleW,
    ((this.crazyMode?this.height*2:this.height) * 1.2));
	this.parent.context.save();
	this.parent.context.font = this.font;
	this.parent.context.fillStyle = this.color;
	this.parent.context.fillText(this.text, this.x*scaleW, this.y*scaleH);
	this.parent.context.restore();
	this.parent.context.fillStyle = style;
	
	if(this.title)
	{
		var size = { height: this.parent.context.font.replace(/px[^0-9]*$/, "") };
		size.width = this.parent.context.measureText(this.title).width;
		
		this.parent.context.font = this.parent.context.font.replace(/[0-9]*[^px]/, size.height * 1.1);
		this.parent.context.clearRect((this.x)*scaleW + (this.width / 2)*scaleW - (size.width / 2)*scaleW, (this.y)*scaleH - (size.height * 2)*scaleW, 
        size.width*scaleW, (scaleW*size.height) * 1.2);
        this.parent.context.fillStyle = this.crazyMode?this.color:this.titleColor;
		this.parent.context.fillText(this.title, (this.x + (this.width / 2) - (size.width / 2))*scaleW, (this.y - (size.height * 2))*scaleH);
		this.parent.context.font = this.font;
	}
}
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
