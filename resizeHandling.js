function resizeHandling(Canvas)
{   
    this.setScene= function(Scene)
    {
        this.scene = Scene;
        this.scene.canvas = this.canvas;
        this.crz();
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

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
        this.scene.update(); 
    }    
    this.canvas = Canvas;
    this.scene = null; 
    window.addEventListener('resize', this.resizeCanvas.bind(this), false);
}
