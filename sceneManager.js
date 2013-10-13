function SceneManager(Canvas)
{
    this.currentScene = null;
    this.sceneArray = new Array();
    this.endGame = false;
    this.canvas = Canvas;
    this.resizeH = new resizeHandling(this.canvas); 
    this.run = function()
    {
        return !this.endGame;
    }
    this.addScene = function(whatScene)
    {
        this.sceneArray.push(whatScene);
    }
    this.setLvl = function(index)
    {
        console.log("setLvlIndex: "+index);
        if(index<this.sceneArray.length && index>=0)
        {
            this.currentScene = this.sceneArray[index];
            this.resizeH.setScene(this.currentScene);
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
            this.setLvl(this.currentScene.nextLevel);
    }
}
function Manager(Canvas)
{
    this.sceneMgr=new SceneManager(Canvas);
    this.addScene = function(whatScene)
    {
        this.sceneMgr.addScene(whatScene);
    }
    this.init = function(startLvlIndex,sceneArr)
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
