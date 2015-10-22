"use strict"
var Point = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

Point.prototype.set = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Point.prototype.getX = function() {
    return this.x;
}
Point.prototype.getY = function() {
    return this.y;
}
Point.prototype.getZ = function() {
    return this.z;
}
