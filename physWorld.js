var pWorld;
function PhysicsWorld()
{
    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); 
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache = new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    var world = new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration); 
    world.setGravity(new Ammo.btVector3(0,-7,0));
    this.addGhost=function(vec,points)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var shape = new Ammo.btConvexHullShape();
        var v = new Ammo.btVector3();
        for(var i=0; i<points.length; i+=3)
        {
            v.setX(points[i]);
            v.setY(points[i+1]);
            v.setZ(points[i+2]);
            shape.addPoint( v  );
        }
        console.log('made convex from vertexes..');
        var ghostObject = new Ammo.btPairCachingGhostObject();
        world.getPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback());
        ghostObject.setCollisionShape(shape);
        ghostObject.setWorldTransform(transform);
        world.addCollisionObject(ghostObject);
        return ghostObject;
    }
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
        var v = new Ammo.btVector3();
        for(var i=0; i<points.length; i+=3)
        {
            v.setX(points[i]);
            v.setY(points[i+1]);
            v.setZ(points[i+2]);
            shape.addPoint( v  );
        }
        console.log('made convex from vertexes..');
        if(isDynamic)
            shape.calculateLocalInertia(mass, localInertia);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        return body;
    }
    this.addBodyTri= function(mass,vec,product)
    {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(vec[0],vec[1],vec[2]));
        var isDynamic = mass !== 0;
        var localInertia = new Ammo.btVector3(0, 0, 0);
        var triMesh = new Ammo.btTriangleMesh;
        var v = new Ammo.btVector3();
        for(var i=0; i<product.tIndex.length; i+=3)
        {
            var id0= product.tIndex[i]*3;
            var id1= product.tIndex[i+1]*3;
            var id2= product.tIndex[i+2]*3;
            var v0 = new Ammo.btVector3(product.vertexPoints[id0], product.vertexPoints[id0+1], product.vertexPoints[id0+2]);
            var v1 = new Ammo.btVector3(product.vertexPoints[id1], product.vertexPoints[id1+1], product.vertexPoints[id1+2]);
            var v2 = new Ammo.btVector3(product.vertexPoints[id2], product.vertexPoints[id2+1], product.vertexPoints[id2+2]);
            triMesh.addTriangle(v0,v1,v2);
        }
        var shape = new Ammo.btBvhTriangleMeshShape(triMesh,true);
        if(isDynamic)
            shape.calculateLocalInertia(mass, localInertia);
        var motionState = new Ammo.btDefaultMotionState(transform);
        var rigidInfo = new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        var body = new Ammo.btRigidBody(rigidInfo);
        world.addRigidBody(body);
        console.log("trimeshinit");
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
    this.update= function(time,slowMo)
    {
        if(!slowMo)
            world.stepSimulation(time,100,1/60);
        else
            world.stepSimulation(time/slowMo,100,(0.25/60));

    }
    this.destroy=function()
    {
        Ammo.destroy(collisionConfiguration);
        Ammo.destroy(dispatcher);
        Ammo.destroy(overlappingPairCache);
        Ammo.destroy(solver);
    }
}
