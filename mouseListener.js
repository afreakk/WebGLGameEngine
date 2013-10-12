function mouse()
{
    this.x = 0;
    this.y = 0;
}
function MouseListener(ev)
{
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
}

