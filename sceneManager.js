function SceneManager(Canvas,Meshes,Plane)
{
    this.currentScene = null;
    this.endGame = false;
    this.canvas = Canvas;
    this.resizeH = new resizeHandling(this.canvas); 
    var meshes = Meshes;
    var plane = Plane;
    this.run = function()
    {
        return !this.endGame;
    }
    this.setLvl = function(index)
    {
        console.log("setLvlIndex: "+index);
        if(index<2 && index>=0)
        {
            this.currentScene = (index===1)?new SceneOne(meshes,plane):new SceneTwo(meshes,plane);
            this.resizeH.setScene(this.currentScene);
            this.currentScene.endScene = false;
            this.currentScene.GLSettings();
            this.currentScene.init();
        }
        else
        {
            alert("Game Over");
            this.endGame=true;
        }
    }
    this.update = function()
    {
        if(!this.currentScene.endScene)
            this.currentScene.update();
        else
            this.setLvl(this.currentScene.nextLvl);
    }
}
function Manager(Canvas,Meshes,Plane)
{
    this.sceneMgr=new SceneManager(Canvas,Meshes,Plane);
    this.addScene = function(whatScene)
    {
        this.sceneMgr.addScene(whatScene);
    }
    this.init = function(startLvlIndex)
    {
        this.sceneMgr.setLvl(startLvlIndex);
    }
    this.animFrame = function()
    {
        if(this.sceneMgr.run())
        {
            this.sceneMgr.update();
            window.requestAnimFrame(this.animFrame.bind(this), this.canvas);
        }
        else
        {
            alert("thanks for playing.");
        }
    }
}
