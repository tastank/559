"use strict"
var point = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

point.prototype.set = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

