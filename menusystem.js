
function MenuAnimator(Items,EndPos,xyStart,xzStart,xwidthSpacing,Quad)
{
    var quad = Quad;
    var items = Items;
    var animators = new Array();
    var endPos = EndPos;
    var widthSpacing = (xwidthSpacing === undefined)?20:xwidthSpacing;
    var yStart = (xyStart === undefined)?-7.5:xyStart;
    var zStart = (xzStart === undefined)?-10:xzStart;
    var selected = 0;
    var isInFocus = new Array();
    var timeSinceKeyPress=0;
    var keyPressTimeTreshold = 0.2;
    var doesSwitchImage = false;
    var noControls = false;
    init();
    this.setNoControl=function(val)
    {
        noControls= val;
    }
    this.setSwitchImage=function(val)
    {
        doesSwitchImage=val;
    }
    function init()
    {
        if(quad===true)
            initQuadView()
        else
            for(var i=0; i<items.length; i++)
            {
                animators[i] = new ItemAnimator(items[i],vec3.fromValues(widthSpacing*(i+0.5)-widthSpacing*(items.length/2),yStart,zStart),endPos);
                isInFocus[i] = false;
            }
    }
    function initQuadView()
    {
        var x=0,y=0;
        for(var i=0; i<items.length; i++)
        {
            if(x<4)
                x++;
            else
            {
                x=1;
                y++;
            }
            animators[i] = new ItemAnimator(items[i],vec3.fromValues(widthSpacing*(x+0.5)-widthSpacing*(4/2),yStart+y*(widthSpacing/1.2),zStart),endPos);
            isInFocus[i] = false;
        }
    }
    this.update=function(dt)
    {
        if(!noControls)
            controls(dt);
        updateAnimators(dt);
    }
    this.getSelected=function()
    {
        if(isInFocus[selected]===true)
            return selected;
        return null;
    }
    function controls(dt)
    {
        timeSinceKeyPress+=dt;
        if(timeSinceKeyPress>keyPressTimeTreshold)
        {
            if(key.Right)
                incrementSelect(true)
            else if(key.Left)
                incrementSelect(false);
        }

    }
    function incrementSelect(val)
    {
        if(val === true)
        {
            if(selected < animators.length-1)
            {
                timeSinceKeyPress=0;
                selected++;
                audioMgr.rewindSpec("roboTrans");
            }
        }
        else
        {
            if(selected > 0)
            {
                timeSinceKeyPress=0;
                selected--;
                audioMgr.rewindSpec("roboTrans");
            }
        }
    }
    function updateAnimators(dt)
    {
        for(var i=0; i<animators.length; i++)
        {
            if(i === selected)
                animators[i].setSelect(true);
            else
                animators[i].setSelect(false);
            isInFocus[i] = animators[i].update(dt);
            if(doesSwitchImage===true)
                switchImage(items[i],isInFocus[i]);
        }
    }
    function switchImage(item,elementFocus)
    {
        if(elementFocus === true)
        {
            if(item.getTexture()[0] === "s")
                return;
            else
            {
                var nam = "s"+item.getTexture().slice(1);
                item.setTexture(nam);
            }
        }
        else
        {
            if(item.getTexture()[0] === "u")
                return;
            else
            {
                var nam = "u"+item.getTexture().slice(1);
                item.setTexture(nam);
            }
        }
    }
}
function ItemAnimator(Item,StartingPos,EndPos)
{
    var startPos = StartingPos;
    var endPos = EndPos;
    var item = Item;
    var currPos = vec3.create();
    var selected = false;
    var crossFade = 0.1;
    this.setSelect=function(val)
    {
        selected = val;
    }
    this.getSelect=function()
    {
        return selected;
    }
    this.update=function(dt)
    {
        var animate = positionChanged(dt);
        if(animate === true)
            return animateItem();
        return selected?true:false;
    }
    function positionChanged(dt)
    {
        var animate = true;
        if(selected === true)
        {
            if(crossFade<1.0)
                crossFade += dt;
            else
                animate = false;
        }
        else
        {
            if(crossFade>0.0)
                crossFade -= dt;
            else
                animate = false;
        }
        return animate;
    }
    function animateItem()
    {
        audioMgr.playSpec('roboTrans');
        vec3.lerp(currPos,startPos,EndPos,crossFade);
        item.global.setPosition(currPos);
        return false;
    }
}
