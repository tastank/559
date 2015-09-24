"use strict";

var Rprism = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.set = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.draw = function(camera_matrix, projection_matrix, viewport_matrix) {
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

    line(p1, p2, camera_matrix, projection_matrix, viewport_matrix); 
    line(p1, p3, camera_matrix, projection_matrix, viewport_matrix); 
    line(p1, p5, camera_matrix, projection_matrix, viewport_matrix); 
    line(p2, p4, camera_matrix, projection_matrix, viewport_matrix); 
    line(p2, p6, camera_matrix, projection_matrix, viewport_matrix); 
    line(p3, p4, camera_matrix, projection_matrix, viewport_matrix); 
    line(p3, p7, camera_matrix, projection_matrix, viewport_matrix); 
    line(p4, p8, camera_matrix, projection_matrix, viewport_matrix); 
    line(p5, p6, camera_matrix, projection_matrix, viewport_matrix); 
    line(p5, p7, camera_matrix, projection_matrix, viewport_matrix); 
    line(p6, p8, camera_matrix, projection_matrix, viewport_matrix); 
    line(p7, p8, camera_matrix, projection_matrix, viewport_matrix); 
}

