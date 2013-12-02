function AudiManager()
{
    var currentID = null;
    //audiofiles
    var audioFiles = new Array();
    var multiSound = new Array();
    var dancers = new Array();
    var audioLocation = "audio/";
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
        dancers['roboTrans'] = new Dancer();
        dancers['roboTrans'].load(audioFiles['roboTrans']);
    }
    function loadAudio()
    {
        audioFiles['brothers']  = new Audio(audioLocation+"b.ogg");
        audioFiles['brothers'].addEventListener('progress', function (){ increaseLoading('.');});
        audioFiles['cannon']    = new Audio(audioLocation+"cannon.ogg");
        audioFiles['cannon'].addEventListener('progress', function (){ increaseLoading('.');});
        audioFiles['pin']       = new Audio(audioLocation+"pin.ogg");      //init caching 
        audioFiles['pin'].addEventListener('progress', function (){ increaseLoading('.');});
        audioFiles['robb']      = new Audio(audioLocation+"robb.ogg");
        audioFiles['robb'].addEventListener('progress', function (){ increaseLoading('.');});
        audioFiles['roboTrans']      = new Audio(audioLocation+"roboTrans.ogg");
        audioFiles['roboTrans'].addEventListener('progress', function (){ increaseLoading('.');});
    }
    this.playSpec=function(str,force)
    {
        playSomething(str,force);
    }
    this.play=function(str,forceRestart)
    {
        audioFiles[str].play();
    }
    this.playSequential=function(str,volume)
    {
        multiSound.push(new Audio());
        var indx = multiSound.length-1;
        multiSound[indx].src = audioLocation+str+".ogg"; 
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
        if(dancers[id].isLoaded()===true)
        {
            dancers[id].play();
            currentID = id;
        }
        else
        {
            console.log("id request is not loaded,load them in initfunction");
        }
    }
    this.rewindSpec=function(id)
    {
        dancers[id].audio.currentTime=0;
    }
    this.getDB=function()
    {
        if(dancers[currentID].isPlaying())
            return dancers[currentID].getFrequency(0,500);
        return 0;

    }
}
