
function key()
{
    this.Left=new Boolean();
    this.Right=new Boolean();
    this.Up=new Boolean();
    this.Down=new Boolean();
    this.Q=new Boolean();
    this.E=new Boolean();
}
key.Left=false;
key.Right=false;
key.Up=false;
key.Down=false;
key.Q=false;
key.E=false;
function onKeyDown(event)
{
    if(event.keyCode == 37||event.keyCode == 65) 
        key.Left=true;
    else if(event.keyCode == 39||event.keyCode == 68) 
        key.Right=true;
    else if(event.keyCode == 38||event.keyCode == 87)
        key.Up=true;
    else if(event.keyCode == 40||event.keyCode == 83)
        key.Down=true;
    else if(event.keyCode == 81)
        key.Q=true;
    else if(event.keyCode == 69)
        key.E=true;
}
function onKeyUp(event)
{    
    if(event.keyCode == 37||event.keyCode == 65) 
        key.Left=false;
    else if(event.keyCode == 39||event.keyCode == 68) 
        key.Right=false;
    else if(event.keyCode == 38||event.keyCode == 87)
        key.Up=false;
    else if(event.keyCode == 40||event.keyCode == 83)
        key.Down=false;
    else if(event.keyCode == 81)
        key.Q=false;
    else if(event.keyCode == 69)
        key.E=false;
}
