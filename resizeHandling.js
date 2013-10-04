function resizeHandling(Canvas)
{   
    this.setScene= function(Scene)
    {
        this.scene = Scene;
        this.crz();
        this.scene.canvas = this.canvas;
    }
    this.crz= function()
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    this.resizeCanvas = function() 
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.scene.update(); 
    }    
    this.canvas = Canvas;
    this.scene = null; 
    window.addEventListener('resize', this.resizeCanvas.bind(this), false);
}
