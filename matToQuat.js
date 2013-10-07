function huh ( m ) 
{

    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = m;

        m11 = te[0], m12 = te[4], m13 = te[8],
        m21 = te[1], m22 = te[5], m23 = te[9],
        m31 = te[2], m32 = te[6], m33 = te[10],

        trace = m11 + m22 + m33;
        var s;

    if ( trace > 0 ) {

        s = 0.5 / Math.sqrt( trace + 1.0 );

        w = 0.25 / s;
        x = ( m32 - m23 ) * s;
        y = ( m13 - m31 ) * s;
        z = ( m21 - m12 ) * s;

    } else if ( m11 > m22 && m11 > m33 ) {

        s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

        w = (m32 - m23 ) / s;
        x = 0.25 * s;
        y = (m12 + m21 ) / s;
        z = (m13 + m31 ) / s;

    } else if ( m22 > m33 ) {

        s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

        w = (m13 - m31 ) / s;
        x = (m12 + m21 ) / s;
        y = 0.25 * s;
        z = (m23 + m32 ) / s;

    } else {

        s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

        w = ( m21 - m12 ) / s;
        x = ( m13 + m31 ) / s;
        y = ( m23 + m32 ) / s;
        z = 0.25 * s;

    }
    var q = quat.fromValues(x,y,z,w);
    //updateEuler();

    return q;

}
