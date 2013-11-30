var audioMgr = new AudiManager();
function AudiManager()
{
    var currentID = null;
    //audiofiles
    var audioFiles = new Array();
    var multiSound = new Array();
    var dancers = new Array();
    ///audiofiles
    init();
    function init()
    {
        Dancer.setOptions({
        flashJS   : 'dancer/lib/soundmanager2.js',
        });
        loadAudio();
        dancers['brothers'] = new Dancer();
        dancers['brothers'].load(audioFiles['brothers']);
        dancers['robb'] = new Dancer();
        dancers['robb'].load(audioFiles['robb']);
    }
    function loadAudio()
    {
        audioFiles['brothers']  = document.getElementsByTagName('audio')[0];
        audioFiles['cannon']    = document.getElementsByTagName('audio')[1];
        audioFiles['pin']       = document.getElementsByTagName('audio')[2];
        audioFiles['robb']      = document.getElementsByTagName('audio')[3];
    }
    this.playSpec=function(str,force)
    {
        playSomething(str,force);
    }
    this.play=function(str,forceRestart)
    {
        audioFiles[str].currentTime = 0;
        audioFiles[str].play();
    }
    this.playSequential=function(str,volume)
    {
        multiSound.push(new Audio());
        var indx = multiSound.length-1;
        multiSound[indx].src = str;
        if(volume !== undefined&&!isNaN(volume))
        {
            if(volume>=1)
                multiSound[indx].volume = 1;
            else
                multiSound[indx].volume = volume;
        }
        multiSound[indx].play();
        updateMulti();
    }
    function updateMulti()
    {
        for(var i=0; i<multiSound.length; i++)
        {
            if(multiSound[i].ended===true)
                multiSound.splice(i,1);
        }
    }
    this.pauseSpec=function(id)
    {
        if(dancers[id].isPlaying!==false)
            dancers[id].pause();
    }
    function playSomething(id,force)
    {
        if(dancers[id].isLoaded)
        {
            if(dancers[id].isPlaying!== true||force === true)
            {
                dancers[id].play();
            }
            currentID = id;
        }
        else
        {
            console.log("id request is not loaded");
        }
    }
    this.getDB=function()
    {
        if(dancers[currentID].isPlaying())
            return dancers[currentID].getFrequency(0,500);
        return 0;

    }
}
