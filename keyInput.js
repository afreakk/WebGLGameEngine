
function key()
{
    this.Left=new Boolean();
    this.Right=new Boolean();
    this.Up=new Boolean();
    this.Down=new Boolean();
    this.Q=new Boolean();
    this.E=new Boolean();
    this.SPACE = new Boolean();
    this.H = new Boolean();
}
key.Left=false;
key.Right=false;
key.Up=false;
key.Down=false;
key.Q=false;
key.E=false;
key.SPACE=false;
key.H=false;
function onKeyDown(event)
{
    if(event.keyCode == 37||event.keyCode == 65) 
        key.Left=true;
    if(event.keyCode == 39||event.keyCode == 68) 
        key.Right=true;
    if(event.keyCode == 38||event.keyCode == 87)
        key.Up=true;
    if(event.keyCode == 40||event.keyCode == 83)
        key.Down=true;
    if(event.keyCode == 81)
        key.Q=true;
    if(event.keyCode == 69)
        key.E=true;
    if(event.keyCode == 32)
        key.SPACE=true;
    if(event.keyCode == 72)
        key.H=true;
}
function onKeyUp(event)
{    
    if(event.keyCode == 37||event.keyCode == 65) 
        key.Left=false;
    if(event.keyCode == 39||event.keyCode == 68) 
        key.Right=false;
    if(event.keyCode == 38||event.keyCode == 87)
        key.Up=false;
    if(event.keyCode == 40||event.keyCode == 83)
        key.Down=false;
    if(event.keyCode == 81)
        key.Q=false;
    if(event.keyCode == 69)
        key.E=false;
    if(event.keyCode == 32)
        key.SPACE=false;
    if(event.keyCode == 72)
        key.H=false;
}
