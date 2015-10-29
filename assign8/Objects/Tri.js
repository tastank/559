"use strict";

var v3 = twgl.v3;

var Tri = function(p1, p2, p3) {
    this.set(p1, p2, p3);
}

Tri.prototype.set = function(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    //calculate normal here
    this.normal = v3.cross([p2.getX() - p1.getX(), p2.getY() - p1.getY(), p2.getZ() - p1.getZ()], [p3.getX() - p1.getX(), p3.getY() - p1.getY(), p3.getZ() - p1.getZ()]);
}

//I'll leave this in here in case I want to do more with it later
Tri.prototype.setColor = function(color) {
    this.color = color;
}

Tri.prototype.getNormal = function() {
  return Array.prototype.slice.call(this.normal);
}

Tri.prototype.getP1 = function() {
    return this.p1;
}

Tri.prototype.getP2 = function() {
    return this.p2;
}

Tri.prototype.getP3 = function() {
    return this.p3;
}

Tri.prototype.getVertexArray = function() {
  return [
    this.p1.x, this.p1.y, this.p1.z,
    this.p2.x, this.p2.y, this.p2.z,
    this.p3.x, this.p3.y, this.p3.z
  ];
}

Tri.prototype.getTexCoordArray = function() {
    return [
        this.p1.u, this.p1.v,
        this.p2.u, this.p2.v,
        this.p3.u, this.p3.v
    ];
}

Tri.prototype.getColor = function() {
    return this.color;
}
