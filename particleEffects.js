function Explosion(drawObjects, product,shaderProgram,pos,numParticles,scale)
{
    var particles = new Array();
    var centerPosition = pos;
    var num = numParticles;
    var scaleX = scale[0];
    var scaleY = scale[1];
    var scaleZ = scale[2];
    var totalNum = 0;
    var time = 0.0;
    var maxSpeed = 0.1;
    var maxMaxDistance = 1.0;
    var alive = false;
    var currentAlpha = 1.0;
    this.setCenter = function(pos) 
    {
        centerPosition = vec3.fromValues(pos[0],pos[1]+0.5,pos[2])
    }
    function init(drawObjects,product,shaderProgram)
    {
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[totalNum]= new rObject(drawObjects,product,shaderProgram,centerPosition);
                    particles[totalNum].setHidden(true);
                    totalNum ++;
                }
            }
        }
        currentAlpha = 1.0;
        console.log(totalNum);
    }
    this.wake = function()
    {
        var i=0;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[i].setHidden(false);
                    particles[i].global.setPosition(centerPosition);
                    i ++;
                }
            }
        }
        currentAlpha = 1.0;
        alive = true;
        time = 0.0;
    }
    function die()
    {
        var i=0;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    particles[i].setHidden(true);
                    i ++;
                }
            }
        }
        alive = false;
    }
    function updateParticles(cameraPosition,dt)
    {
        time += dt;
        currentAlpha -= dt/2.0;
        var i=0;
        var moveScale =10.0*dt;
        var maxDistance = maxMaxDistance;
        for(var y=-num; y<num; y++)
        {
            for(var x=-num; x<num; x++)
            {
                for(var z=-num; z<num; z++)
                {
                    var particlePos = particles[i].global.getPos();

                    var axis= vec3.create();
                    vec3.cross(axis,particlePos, cameraPosition);
                    vec3.normalize(axis,axis);
                    var dot = vec3.dot(vec3.normalize(vec3.create(),particlePos),vec3.normalize(vec3.create(),cameraPosition));
                    var ang = Math.acos(dot);
                    var pRot=quat.create();
                    quat.setAxisAngle(pRot,axis, ang);

                    particles[i].global.setRotation(pRot);

                    var add = time;

                    var zMod = Math.abs(simplex.noise3d(i/totalNum, time, Math.random())*moveScale)*-1.0;
                    var xMod = (Math.sin((i/totalNum)*Math.PI*2.0)*moveScale*Math.random())*Math.abs(simplex.noise3d(Math.random(),zMod,i/totalNum));
                    var yMod = (Math.cos((i/totalNum)*Math.PI*2.0)*moveScale*Math.random())*Math.abs(simplex.noise3d(Math.random(),zMod,i/totalNum));

                    var mov = vec3.fromValues(xMod,yMod,zMod);
                    var absPos = vec3.create();
                    vec3.add(absPos,particlePos,mov)
                    //if(vec3.distance(absPos,centerPosition)<maxDistance)
                    particles[i].global.translate(mov);
                    particles[i].alpha = currentAlpha;

                    i++;
                }
            }
        }
    }
    this.update = function(cameraPosition, dt)
    {
        if(alive)
        {
            updateParticles(cameraPosition,dt);
            if(currentAlpha<= 0.0){
                die();
            }
        }
    }
    init(drawObjects,product,shaderProgram);
}
