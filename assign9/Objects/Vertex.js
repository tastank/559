"use strict"
var Vertex = function(x,y,z, u,v) {
    //spatial coords
    this.set_position(x,y,z);
    //texture coords
    this.set_texture(u,v);
};

Vertex.prototype.set_position = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vertex.prototype.set_texture = function(u,v) {
    this.u = u;
    this.v = v;
}

Vertex.prototype.getX = function() {
    return this.x;
}
Vertex.prototype.getY = function() {
    return this.y;
}
Vertex.prototype.getZ = function() {
    return this.z;
}

Vertex.prototype.getU = function() {
    return this.u;
}
Vertex.prototype.getV = function() {
    return this.v;
}
