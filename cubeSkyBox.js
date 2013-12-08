function skyboxContainer(cubeSideSize)
{
    var skyBoxGeometry = {};
    //    0 _______3_
    //    /|      /|  
    //   / |     / |   WOW	
    //|1/__|5__2/__|4
    //  |  /	 | /   Så PENT
    //  | / 	 |/				MUCH ART
    //  |/_6____7|
    skyBoxGeometry.skyBoxVertexPosition =
    [
        -cubeSideSize,  cubeSideSize,  cubeSideSize,    //v0
        -cubeSideSize,  cubeSideSize, -cubeSideSize,	//v1
         cubeSideSize,  cubeSideSize, -cubeSideSize,	//v2
         cubeSideSize,  cubeSideSize,  cubeSideSize, 	//v3
         cubeSideSize, -cubeSideSize,  cubeSideSize, 	//v4
        -cubeSideSize, -cubeSideSize,  cubeSideSize, 	//v5	
        -cubeSideSize, -cubeSideSize, -cubeSideSize, 	//v6
         cubeSideSize, -cubeSideSize, -cubeSideSize		//v7
    ];
    skyBoxGeometry.skyBoxVertexIndices =
    [
        0,1,2,  2,3,1,
        1,6,7,  7,2,1,
        1,0,5,  6,1,5,
        5,3,0,  5,4,3,
        3,2,7,  7,4,2,
        6,7,4,  4,5,6
    ];

    skyBoxGeometry.skyBoxNormals = 
    [
        0.0,  0.0,  0.0,    //v0
        0.0,  0.0,  0.0,	//v1
        0.0,  0.0,  0.0,	//v2
        0.0,  0.0,  0.0, 	//v3
        0.0,  0.0,  0.0, 	//v4
        0.0,  0.0,  0.0, 	//v5	
        0.0,  0.0,  0.0, 	//v6
        0.0,  0.0,  0.0		//v7
    ];


    // var n 2

    skyBoxGeometry.skyVerts = 
    [
        // front face
        -cubeSideSize, -cubeSideSize,  cubeSideSize,
        cubeSideSize, -cubeSideSize,  cubeSideSize,
        cubeSideSize,  cubeSideSize,  cubeSideSize,
        -cubeSideSize,  cubeSideSize,  cubeSideSize,
        
        // back face
        -cubeSideSize, -cubeSideSize, -cubeSideSize,
        -cubeSideSize,  cubeSideSize, -cubeSideSize,
        cubeSideSize,  cubeSideSize, -cubeSideSize,
        cubeSideSize, -cubeSideSize, -cubeSideSize,
        
        // top face
        -cubeSideSize,  cubeSideSize, -cubeSideSize,
        -cubeSideSize,  cubeSideSize,  cubeSideSize,
        cubeSideSize,  cubeSideSize,  cubeSideSize,
        cubeSideSize,  cubeSideSize, -cubeSideSize,
        
        // bottom face
        -cubeSideSize, -cubeSideSize, -cubeSideSize,
        cubeSideSize, -cubeSideSize, -cubeSideSize,
        cubeSideSize, -cubeSideSize,  cubeSideSize,
        -cubeSideSize, -cubeSideSize,  cubeSideSize,
        
        // right face
        cubeSideSize, -cubeSideSize, -cubeSideSize,
        cubeSideSize,  cubeSideSize, -cubeSideSize,
        cubeSideSize,  cubeSideSize,  cubeSideSize,
        cubeSideSize, -cubeSideSize,  cubeSideSize,
        
        // left face
        -cubeSideSize, -cubeSideSize, -cubeSideSize,
        -cubeSideSize, -cubeSideSize,  cubeSideSize,
        -cubeSideSize,  cubeSideSize,  cubeSideSize,
        -cubeSideSize,  cubeSideSize, -cubeSideSize,
    ];
    var s0 = 0.0;
    var s1 = 0.25;
    var s2 = 0.5;
    var s3 = 0.75;
    var s4 = 1.0;
    var h = 1/3;
    var hh = 2/3;
    skyBoxGeometry.skyTexCoords = 
    [
        // front face
        s1, h,
        s2, h,
        s2, hh,
        s1, hh,
        
        // back face
        s4, h,
        s4, hh,
        s3, hh,
        s3, h,
        
        // bott face
        
        0.25, 1,
        0.25, hh,
        0.5, hh,
        0.5, 1,

        
        // top face
        0.25, 0.0,
        0.5, 0.0,
        0.5, h,
        0.25, h,
        
        
        // right face
        0.75, h,
        0.75, hh,
        0.5, hh,
        0.5, h,
        // left face
        s0, h,
        s1, h,
        s1, hh,
        s0, hh
    ];

    skyBoxGeometry.skyIndices = [
    0, 1, 2,      0, 2, 3,    // front face
    4, 5, 6,      4, 6, 7,    // back face
    8, 9, 10,     8, 10, 11,  // top face
    12, 13, 14,   12, 14, 15, // bottom face
    16, 17, 18,   16, 18, 19, // right face
    20, 21, 22,   20, 22, 23  // left face
    ];
    return skyBoxGeometry;
}
