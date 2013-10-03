function SceneManager()
{
    this.currentScene = null;
    this.sceneArray = new Array();
    this.endGame = false;
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
        console.error("setLvl: "+index);
        if(index<this.sceneArray.length && index>=0)
        {
            this.currentScene = this.sceneArray[index];
            this.currentScene.init(index);
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
function Manager()
{
    this.sceneMgr=new SceneManager();
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
            window.requestAnimFrame(this.animFrame.bind(this), canvas);
        }
        else
        {
            alert("thanks for playing.");
        }
    }
}
