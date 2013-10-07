function DrawableObjects()
{
    var objects = new Array();
    this.add=function(obj)
    {
        objects.push(obj);
    }
    this.draw=function()
    {
        for(var i=0; i<objects.length; i++)
            objects[i].draw();
    }
}
