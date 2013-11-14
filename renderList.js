function DrawableObjects()
{
    var objects = new Array();
    this.add = function(obj)
    {
        objects.push(obj);
        return (objects.length-1);
    }
    this.draw = function()
    {
        for(var i=0; i<objects.length; i++)
        {
            if( objects[i] != null)
            {
                objects[i].draw();
            }
            else
            {

            }
        }
    }
    this.hide = function(index)
    {
        objects[index] = null;
    }
    this.show = function(index,obj)
    {
        objects[index] = obj;
    }
}
