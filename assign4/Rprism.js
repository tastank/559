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

    var dists = [0,0,0,0,0,0,0,0,0,0,0,0];
    var centers = [
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0),
        new Point(0,0,0)
    ];

    for (var i = 0; i < tris.length; i++) {
        var P1 = get2d_coords(tris[i].getP1(), camera_matrix, projection_matrix, viewport_matrix);
        var P2 = get2d_coords(tris[i].getP2(), camera_matrix, projection_matrix, viewport_matrix);
        var P3 = get2d_coords(tris[i].getP3(), camera_matrix, projection_matrix, viewport_matrix);
        centers[i] = new Point(
            (P1.getX() + P2.getX() + P3.getX()) / 3,
            (P1.getY() + P2.getY() + P3.getY()) / 3,
            (P1.getZ() + P2.getZ() + P3.getZ()) / 3
        );
        dists[i] = centers[i].getZ();

    }

    if (sort) {
        for (var i = 0; i < dists.length; i++) {
            var maxdist = -9999999;
            var maxindex = 0;
            for (var j = i; j < dists.length; j++) {
                if (dists[j] > maxdist) {
                    maxdist = dists[j];
                    maxindex = j;
                }
            }
            var tmp_dist = dists[i];
            var tmp_center = centers[i];
            var tmp_tri = tris[i];
            dists[i] = dists[maxindex];
            centers[i] = centers[maxindex];
            tris[i] = tris[maxindex];
            dists[maxindex] = tmp_dist;
            centers[maxindex] = tmp_center;
            tris[maxindex] = tmp_tri;
        }

    }

    for (var i = 0; i < tris.length; i++) {
        var P1 = tris[i].getP1();
        var P2 = tris[i].getP2();
        var P3 = tris[i].getP3();
        var normal = v3.cross([P2.getX() - P1.getX(), P2.getY() - P1.getY(), P2.getZ() - P1.getZ()], [P3.getX() - P1.getX(), P3.getY() - P1.getY(), P3.getZ() - P1.getZ()]);

        normal = v3.normalize(normal);
        var dot = v3.dot(normal, [0, 1, 0]);
        var shade = 80 + 80 * dot;
        ctx.fillStyle = "rgb(" + shade + ", " + shade + ", " + shade + ")"


        tris[i].draw(ctx, wireframe, camera_matrix, projection_matrix, viewport_matrix);
    }

}
