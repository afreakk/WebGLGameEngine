var pWorld;
function PhysicsWorld()
{
    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); 
    var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    var overlappingPairCache = new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    var world = new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration); 
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
    this.update= function()
    {
        world.stepSimulation(1/60,10);
    }
    this.destroy=function()
    {
        Ammo.destroy(collisionConfiguration);
        Ammo.destroy(dispatcher);
        Ammo.destroy(overlappingPairCache);
        Ammo.destroy(solver);
    }
}
