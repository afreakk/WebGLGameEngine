var pWorld;
function PhysicsWorld()
{
    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); 
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache = new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    var world = new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration); 
    world.setGravity(new Ammo.btVector3(0,-10,0));
    this.getWorld = function()
    {
        return world;
    }
    this.addBodyHasShape=function(mass,vec,shape)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var localInertia = new Ammo.btVector3(0, 0, 0);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        return body;
    }
    this.addBody=function(mass,vec,scale)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var isDynamic = mass !== 0;
        var localInertia = new Ammo.btVector3(0, 0, 0);
        var shape = new Ammo.btBoxShape(new Ammo.btVector3(scale[0],scale[1],scale[2]));
        if(isDynamic)
            shape.calculateLocalInertia(mass, localInertia);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        return body;
    }
    this.addConstaint= function(constraint)
    {
        world.addConstraint(constraint);
    }
    this.addBodyConvex= function(mass,vec,points)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var isDynamic = mass !== 0;
        var localInertia = new Ammo.btVector3(0, 0, 0);
        var shape = new Ammo.btConvexHullShape();
        var vec = new Ammo.btVector3();
        for(var i=0; i<points.length; i+=3)
        {
            vec.setX(points[i]);
            vec.setY(points[i+1]);
            vec.setZ(points[i+2]);
            shape.addPoint( vec  );
        }
        console.log('made convex from vertexes..');
/*        var hull = Ammo.btShapehull(shape);
        var margin = shape.getMargin(); ser ikke ut som det er implementert
        hull.buildHull(margin);
        var simplifiedShape = new Ammo.btConvexHullShape(shape.getVertexPointer(),shape.numVerticies());*/
        if(isDynamic)
            shape.calculateLocalInertia(mass, localInertia);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        return body;
    }
    this.oblig2Shape = function(size,vec,mass)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var localInertia = new Ammo.btVector3(0, 0, 0);
        var shapeHalf = new Ammo.btBoxShape(new Ammo.btVector3(size*(0.25),size,1.0));
        var shapeOverDoor = new Ammo.btBoxShape(new Ammo.btVector3(size*(0.25),size/2.0,1.0));
        var overDoorPos = new Ammo.btVector3(0,size/2,size);
        var pos1 = new Ammo.btVector3(-size/2.0,0.0,size);//venstre forran 
        var pos2 = new Ammo.btVector3(+size/2.0,0.0,size);//høyreforran
        var shapeWhole = new Ammo.btBoxShape(new Ammo.btVector3(size,size,1));
        var pos3 = new Ammo.btVector3(0,0,-size); //bak Hel
        var shapeSideWhile = new Ammo.btBoxShape(new Ammo.btVector3(1,size,size));
        var pos4 = new Ammo.btVector3(size,0,0); // side
        var pos5 = new Ammo.btVector3(-size,0,0);//side
        var shapeTop = new Ammo.btBoxShape(new Ammo.btVector3(size,1,size));
        var posTop = new Ammo.btVector3(0,size,0);
        var compoundShape = new Ammo.btCompoundShape();
        var t1 = new Array();
        for(var i=0; i<7; i++)
        {
            t1[i] = new Ammo.btTransform();
            t1[i].setIdentity();
        }
        t1[0].setOrigin(pos1);
        t1[1].setOrigin(pos2);
        t1[2].setOrigin(pos3);
        t1[3].setOrigin(pos4);
        t1[4].setOrigin(pos5);
        t1[5].setOrigin(posTop);
        t1[6].setOrigin(overDoorPos);
        compoundShape.addChildShape(t1[0],shapeHalf);
        compoundShape.addChildShape(t1[1],shapeHalf);
        compoundShape.addChildShape(t1[2],shapeWhole);
        compoundShape.addChildShape(t1[3],shapeSideWhile);
        compoundShape.addChildShape(t1[4],shapeSideWhile);
        compoundShape.addChildShape(t1[5],shapeTop);
        compoundShape.addChildShape(t1[6],shapeOverDoor);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,compoundShape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        return body;
    }
    this.update= function(time)
    {
        world.stepSimulation(time,6);
    }
    this.destroy=function()
    {
        Ammo.destroy(collisionConfiguration);
        Ammo.destroy(dispatcher);
        Ammo.destroy(overlappingPairCache);
        Ammo.destroy(solver);
    }
}
