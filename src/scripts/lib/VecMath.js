VecMath = function () {
    this.Vec3D = new Vec3();
}

VecMath.prototype.calcCenterPointBetween2Vec3 = function (startVec3, endVec3) {
    var vec3 = new Vec3();

    var vec3AB = {
        x: endVec3.x - startVec3.x,
        y: endVec3.y - startVec3.y,
        z: endVec3.z - startVec3.z
    };

    vec3.x = startVec3.x + (0.5 * vec3AB.x);
    vec3.y = startVec3.y + (0.5 * vec3AB.y);
    vec3.z = startVec3.z + (0.5 * vec3AB.z);

    return vec3;
};

/**
**/
VecMath.prototype.calcCenterPointsOfTriangles = function (trianglePoints) {
    var centerPoints = [];

    for (var i = 0; i < trianglePoints.length; i += 3) {
        centerPoints.push(this.calcCenterPointBetween2Vec3(trianglePoints[i], trianglePoints[i + 1]));
        centerPoints.push(this.calcCenterPointBetween2Vec3(trianglePoints[i + 1], trianglePoints[i + 2]));
        centerPoints.push(this.calcCenterPointBetween2Vec3(trianglePoints[i + 2], trianglePoints[i]));
    }

    return centerPoints;
};

/**
 @see Cross Product
**/
VecMath.prototype.calcVectorProduct = function () {
};