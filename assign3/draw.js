// Draws a cube and axes
// Author: T. A. Stank
//
//


"use strict"

var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');

//flattens points into two dimensions
var get2d_coords = function(point, camera_matrix, projection_matrix, viewport_matrix) {
    //TODO: this is where I need to change stuff
    //var proj = m4.multiply(viewport_matrix, projection_matrix);
    //var final_matrix = m4.multiply(proj, camera_matrix);
    var proj = m4.multiply(camera_matrix, projection_matrix);
    var final_matrix = m4.multiply(viewport_matrix, proj);
    var vec = v3.create();
    vec[0] = point.x;
    vec[1] = point.y;
    vec[2] = point.z;
//    vec = [point.x, point.y, point.z];
    var transformed_point = m4.transformPoint(final_matrix, vec);
    return new Point(transformed_point[0], transformed_point[1], 0);
}

var line = function(p1, p2, camera_matrix, projection_matrix, viewport_matrix) {
    p1 = get2d_coords(p1, camera_matrix, projection_matrix, viewport_matrix);
    p2 = get2d_coords(p2, camera_matrix, projection_matrix, viewport_matrix);

    //eh, I'll waste a little efficiency for everything to be more sensible and concise
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

var x_slider = document.getElementById('x_slider');
var y_slider = document.getElementById('y_slider');
var z_slider = document.getElementById('z_slider');
var xrot_slider = document.getElementById('xrot_slider');
var yrot_slider = document.getElementById('yrot_slider');
var zrot_slider = document.getElementById('zrot_slider');

var m4 = twgl.m4;
var v3 = twgl.v3;

var corner1 = new Point(-1, -1, -1);
var corner2 = new Point(1,1,1);
var cube = new Rprism(corner1, corner2);



//here's where we draw shit

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);

    //window now ranges from (0, 0) to ();
    ctx.scale(100, 100);
    //window now ranges from (-2, -2) to (2, 2);
    ctx.translate(2, 2);
    //Orientation is now correct
    ctx.scale(1, -1);

    ctx.lineWidth = 0.01;

    //Do our transformations
    var camera_matrix = m4.identity();
    var camera_translation = v3.create();
    //There has to be a better way, but my other ideas didn't work and this does.
    camera_translation[0] = -x_slider.value;
    camera_translation[1] = -y_slider.value;
    camera_translation[2] = -z_slider.value;
    m4.translate(camera_matrix, camera_translation, camera_matrix);
    m4.rotateX(camera_matrix, xrot_slider.value, camera_matrix);
    m4.rotateY(camera_matrix, -yrot_slider.value, camera_matrix);
    m4.rotateZ(camera_matrix, -zrot_slider.value, camera_matrix);
    var projection_matrix = m4.identity();
    projection_matrix = m4.frustum(-1, 1, -1, 1, -1, 1);
    //I believe this will remain identity, as the cube's coords are in world coords
    var viewport_matrix = m4.identity();
    var viewport_translation = v3.create();
    viewport_translation[0] = 0;
    viewport_translation[1] = 0;
    viewport_translation[2] = 4;
    m4.translate(viewport_matrix, viewport_translation, viewport_matrix);


    
    var o = new Point(0, 0, 0);
    var x = new Point(1, 0, 0);
    var y = new Point(0, 1, 0);
    var z = new Point(0, 0, 1);
    line(o, x, camera_matrix, projection_matrix, viewport_matrix);
    line(o, y, camera_matrix, projection_matrix, viewport_matrix);
    line(o, z, camera_matrix, projection_matrix, viewport_matrix);
    cube.draw(camera_matrix, projection_matrix, viewport_matrix);

    window.requestAnimationFrame(draw);
    ctx.restore();
}

draw();

