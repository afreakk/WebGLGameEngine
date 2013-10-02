function SceneManager()
{
    this.currentScene = null;
    this.sceneArray = new Array();
    this.endGame = false;
    this.init = function(sceneArr)
    {
        this.sceneArray = sceneArr;
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
        //console.error("scenemgrupdate");
        if(!this.currentScene.endScene)
            this.currentScene.update();
        else
            this.setLvl(this.currentScene.nextLevel);
    }
    return this;
}
function initSceneMgr()
{
    this.sceneMgr=null;
    this.init = function(startLvlIndex,sceneArr)
    {
        this.sceneMgr = SceneManager();
        this.sceneMgr.init(sceneArr);
        this.sceneMgr.setLvl(startLvlIndex);
    }
    this.animFrame = function()
    {
        if(!this.sceneMgr.endGame)
        {
            this.sceneMgr.update();
            window.requestAnimFrame(this.animFrame, canvas);
        }
        else
        {
            alert("thanks for playing.");
        }
    }
    return this;
}
