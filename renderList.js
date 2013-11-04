function DrawableObjects()
{
    var objects = new Array();
    this.add=function(obj)
    {
        objects.push(obj);
        return objects.length-1;
    }
    this.draw=function()
    {
        for(var i=0; i<objects.length; i++)
            objects[i].draw();
    }
    this.removeIndex = function(index)
    {
        if(index>-1)
            objects.splice(index,1);
    }
}
