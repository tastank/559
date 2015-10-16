"use strict";

var Rprism = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.set = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
}

Rprism.prototype.getTris = function() {
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

//let's hack this so that the normals are calculated properly
    var tris = [
        new Tri(p1, p2, p4), //left side lower triangle
        new Tri(p1, p4, p3), //Left side upper
        new Tri(p1, p6, p2), //bottom left
        new Tri(p1, p7, p5), //front left
        new Tri(p1, p3, p7), //front right
        new Tri(p1, p5, p6), //bottom right
        new Tri(p2, p8, p4), //back upper
        new Tri(p2, p6, p8), //back lower
        new Tri(p4, p8, p7), //upper right
        new Tri(p3, p4, p7), //upper left 
        new Tri(p5, p7, p6), //right lower
        new Tri(p6, p7, p8)  //right upper
    ];

    return tris;

}



/*   p4 ___________________________  p8
       /|                         /|   
      / |                        / |
     /  |                       /  |
    /   |                      /   |
p3 /____|_____________________/    |
  |     |                     |p7  |
  |     |                     |    |
  |     |                     |    |
  |     |                     |    |
  |   p2|_____________________|____|p6
  |    /                      |    /
  |   /                       |   /
  |  /                        |  /
  | /                         | /
  |/__________________________|/p5
p1                             

*/
