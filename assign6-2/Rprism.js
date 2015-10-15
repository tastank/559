"use strict";

var Rprism = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.set = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.draw = function(ctx, sort, wireframe, camera_matrix, projection_matrix, viewport_matrix) {
    //this will be fun
    //calculate corners
    var p1 = new Point(this.c1.x, this.c1.y, this.c1.z);
    var p2 = new Point(this.c1.x, this.c1.y, this.c2.z);
    var p3 = new Point(this.c1.x, this.c2.y, this.c1.z);
    var p4 = new Point(this.c1.x, this.c2.y, this.c2.z);
    var p5 = new Point(this.c2.x, this.c1.y, this.c1.z);
    var p6 = new Point(this.c2.x, this.c1.y, this.c2.z);
    var p7 = new Point(this.c2.x, this.c2.y, this.c1.z);
    var p8 = new Point(this.c2.x, this.c2.y, this.c2.z);

    var tris = [
        new Tri(p1, p2, p4),
        new Tri(p1, p3, p4),
        new Tri(p1, p2, p6),
        new Tri(p1, p3, p5),
        new Tri(p3, p5, p7),
        new Tri(p1, p6, p5),
        new Tri(p2, p4, p8),
        new Tri(p2, p6, p8),
        new Tri(p4, p7, p8),
        new Tri(p3, p7, p4),
        new Tri(p5, p6, p7),
        new Tri(p6, p7, p8)
    ];


}
