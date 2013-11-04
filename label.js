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
	this.font		= (options.font || "15px monospace");
	this.width		= 0;
	this.height		= 0;
	this.x 			= (options.x || 0);
	this.y			= (options.y || 0);
}

multicrew.Label.prototype.init = function()
{
	if(this.parent && this.parent.canvas)
	{
		this.width		= Number(this.parent.context.measureText(this.text).width);
		this.height		= Number(this.parent.context.font.replace(/px[^0-9]*$/, ""));
		this.lastText	= this.text;
		this.draw();
	}
}

multicrew.Label.prototype.draw = function()
{
	if(!this.parent.canvas)
		return;
	
	if(this.text != this.lastText)
		this.init();
	
	var style = this.parent.context.fillStyle;
	this.parent.context.clearRect(this.x, this.y - this.height, this.width, this.height * 1.2);
	this.parent.context.save();
	this.parent.context.font = this.font;
	this.parent.context.fillStyle = this.color;
	this.parent.context.fillText(this.text, this.x, this.y);
	this.parent.context.restore();
	this.parent.context.fillStyle = style;
	
	if(this.title)
	{
		var size = { height: this.parent.context.font.replace(/px[^0-9]*$/, "") };
		size.width = this.parent.context.measureText(this.title).width;
		
		this.parent.context.font = this.parent.context.font.replace(/[0-9]*[^px]/, size.height * 2);
		this.parent.context.clearRect(this.x + (this.width / 2) - (size.width / 2), this.y - (size.height * 2), size.width, size.height * 1.2);
		this.parent.context.fillText(this.title, this.x + (this.width / 2) - (size.width / 2), this.y - (size.height * 2));
		this.parent.context.font = this.font;
	}
}
