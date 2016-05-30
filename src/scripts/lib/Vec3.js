Vec3 = function () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
};


Vec3.prototype.normalize = function () {
    var vecLength = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));

    this.x = 1 / vecLength * this.x;
    this.y = 1 / vecLength * this.y;
    this.z = 1 / vecLength * this.z;
};