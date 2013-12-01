
var loadingPanel = null;
var loadingBar = null;
function showLoading()
{
    loadingPanel = new multicrew.Panel("panel");
    loadingBar = new multicrew.Label({title: "Loading", text: "...", x:this.canvas.width-this.canvas.width/8,
    y: this.canvas.height-this.canvas.height/16.0, color: "#FFF", titleColor: "#ffff00" });
    loadingPanel.insert(loadingBar);
}
function increaseLoading(str)
{
    if(loadingBar!==null)
    {
        loadingBar.text += str;
        loadingPanel.clear();
        loadingPanel.draw();
    }
}
