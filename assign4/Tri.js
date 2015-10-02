"use strict";

var Tri = function(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
}

Tri.prototype.set = function(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
}

Tri.prototype.draw = function(ctx, wireframe, camera_matrix, projection_matrix, viewport_matrix) {
    if (wireframe) {
        line(this.p1, this.p2, camera_matrix, projection_matrix, viewport_matrix); 
        line(this.p2, this.p3, camera_matrix, projection_matrix, viewport_matrix); 
        line(this.p3, this.p1, camera_matrix, projection_matrix, viewport_matrix); 
    } else {
        var c1 = get2d_coords(this.p1, camera_matrix, projection_matrix, viewport_matrix);
        var c2 = get2d_coords(this.p2, camera_matrix, projection_matrix, viewport_matrix);
        var c3 = get2d_coords(this.p3, camera_matrix, projection_matrix, viewport_matrix);

        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.fill();
        ctx.stroke();
        
    }
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
