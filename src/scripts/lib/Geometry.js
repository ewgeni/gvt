Geometry = function (emuMode, color, verticies, indicies) {

    this.primitive = emuMode || gl.POINTS; 
    this.color = color || { r: 0, g: 0, b: 0, a: 1 };
    this.verticies = verticies || null;
    this.indicies = indicies || null;
};


Geometry.prototype.getVertexPointsAsVec3ByIndex = function (index) {
    var dimemsionOffset = 3;
    var vertexArrIndex = index * dimemsionOffset;

    var vec3 = new Vec3();
    vec3.x = this.verticies[vertexArrIndex];
    vec3.y = this.verticies[vertexArrIndex + 1];
    vec3.z = this.verticies[vertexArrIndex + 2];

    return vec3;
};

Geometry.prototype.setVerticies = function (verticies) {
    this.verticies = verticies;
};

Geometry.prototype.setIndicies = function (indicies) {
    this.indicies = indicies;
};

Geometry.prototype.setColor = function (color) {
    this.color = color;
};
