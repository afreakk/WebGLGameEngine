
function key()
{
    this.Left=new Boolean();
    this.Right=new Boolean();
    this.Up=new Boolean();
    this.Down=new Boolean();
}
key.Left=false;
key.Right=false;
key.Up=false;
key.Down=false;
function onKeyDown(event)
{
    if(event.keyCode == 37) 
        key.Left=true;
    else if(event.keyCode == 39) 
        key.Right=true;
    else if(event.keyCode == 38)
        key.Up=true;
    else if(event.keyCode == 40)
        key.Down=true;
}
function onKeyUp(event)
{    
    if(event.keyCode == 37) 
        key.Left=false;
    else if(event.keyCode == 39) 
        key.Right=false;
    else if(event.keyCode == 38)
        key.Up=false;
    else if(event.keyCode == 40)
        key.Down=false;
 
}
