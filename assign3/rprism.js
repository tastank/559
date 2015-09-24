"use strict";

var rprism = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

rprism.prototype.set = function(c1,c2) {
    this.c1 = c1;
    this.c2 = c2;
}

rprism.prototype.draw = function() {
    //this will be fun
    //calculate corners
    var p1 = new point(c1.x, c1.y, c1.z);
    var p2 = new point(c1.x, c1.y, c2.z);
    var p3 = new point(c1.x, c2.y, c1.z);
    var p4 = new point(c1.x, c2.y, c2.z);
    var p5 = new point(c2.x, c1.y, c1.z);
    var p6 = new point(c2.x, c1.y, c2.z);
    var p7 = new point(c2.x, c2.y, c1.z);
    var p8 = new point(c2.x, c2.y, c2.z);

    line(p1, p2);
    line(p1, p3);
    line(p1, p5);
    line(p2, p4);
    line(p2, p6);
    line(p3, p4);
    line(p3, p7);
    line(p4, p8);
    line(p5, p6);
    line(p5, p7);
    line(p6, p8);
    line(p7, p8);
}

