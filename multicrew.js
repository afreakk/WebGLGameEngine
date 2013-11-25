var multicrew = (multicrew || {});

if(!Math.clamp) Math.clamp = function(val, min, max) { return Math.max(min, Math.min(val, max)); }

multicrew.Panel = function(canvas)
{
	this.canvas		= document.getElementById(canvas);
	this.context	= null;
	this.elements	= [];
	this.height		= this.canvas.height	= this.canvas.offsetHeight;
	this.width		= this.canvas.width		= this.canvas.offsetWidth;
	this.mouse 		= { x: 0, y: 0 };
	
	if(this.canvas instanceof HTMLCanvasElement)
		this.context = this.canvas.getContext("2d");
	
	var self = this;
	this.canvas.onmousewheel = function(e) { self.mouseScrollEvent(e); }
	this.canvas.addEventListener("DOMMouseScroll", function(e) { self.mouseScrollEvent(e); }, false);
	this.canvas.onmousemove = function(e) { self.mouseMoveEvent(e); }
	this.canvas.onresize = function(e) { self.resizeEvent(e); }
	this.canvas.onclick = function(e) { self.mouseClickEvent(e); }
}

multicrew.Panel.prototype.insert = function(element)
{
	element.parent = this;
	element.draw = (element.draw);
	element.init = (element.init);
	
	this.elements.push(element);
	element.init();
	return element;
}

multicrew.Panel.prototype.draw = function()
{
	for(var i = 0; i < this.elements.length; ++i)
		this.elements[i].draw();
}

multicrew.Panel.prototype.clear = function()
{
	this.context.clearRect(0, 0, this.width, this.height);
}

multicrew.Panel.prototype.resizeEvent = function(e)
{
	this.height		= this.canvas.height	= this.canvas.offsetHeight;
	this.width		= this.canvas.width		= this.canvas.offsetWidth;	
	this.draw();
}

multicrew.Panel.prototype.mouseScrollEvent = function(e)
{	
	for(var i = 0; i < this.elements.length; ++i)
	{
		var elem = this.elements[i];
		
		if(isNaN(elem.x + elem.y + elem.width + elem.height))
			continue;
		
		if((this.mouse.x > elem.x && this.mouse.x < elem.x + elem.width)
		&& (this.mouse.y > elem.y && this.mouse.y < elem.y + elem.height))
		{
			elem.scroll = (elem.scroll || {});
			elem.scroll(Math.clamp((e.wheelDeltaY || e.detail), -1, 1));
		}
	}
}

multicrew.Panel.prototype.mouseMoveEvent = function(e)
{
	this.mouse.x = e.clientX;
	this.mouse.y = e.clientY;
}

multicrew.Panel.prototype.mouseClickEvent = function(e)
{
	for(var i = 0; i < this.elements.length; ++i)
	{
		var elem = this.elements[i];
		
		if(isNaN(elem.x + elem.y + elem.width + elem.height))
			continue;
		
		if((this.mouse.x > elem.x && this.mouse.x < elem.x + elem.width)
		&& (this.mouse.y > elem.y && this.mouse.y < elem.y + elem.height))
		{
			elem.click = (elem.click || {});
			elem.click();
		}
	}
}

multicrew.include = function(files, callback)
{
	var loaded = 0;
	
	if(!(files instanceof Array))
		files = Array(files);
	
	for(var i = 0; i < files.length; ++i)
	{
		var elem = document.createElement("script");
		elem.onload = function() { if(++loaded >= files.length) callback(); }
		elem.setAttribute("src", files[i]);
		
		var scripts = document.head.getElementsByTagName("script");
		if(!scripts.length) document.head.appendChild(elem);
		else document.head.insertBefore(elem, scripts[scripts.length - 1]);
	}
}
