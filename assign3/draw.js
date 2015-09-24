"use strict"


var line = function(p1, p2) {
}

var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');

var x_slider = document.getElementById('x_slider');
var y_slider = document.getElementById('y_slider');
var z_slider = document.getElementById('z_slider');
var xrot_slider = document.getElementById('xrot_slider');
var yrot_slider = document.getElementById('yrot_slider');
var zrot_slider = document.getElementById('zrot_slider');


var corner1 = new point(-1, -1, -1);
var corner2 = new point(1,1,1);
var cube = new rprism(corner1, corner2);



//here's where we draw shit

function draw() {
    ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);

    //window now ranges from (0, 0) to (2.667, 2);
    ctx.scale(240, 240);
    //window now ranges from (-1.333, -1) to (1.333, 1);
    ctx.translate(320, 240);
    //Orientation is now correct
    ctx.scale(1, -1);

    //Do our transformations




    cube.draw();

    update();
    window.requestAnimationFrame(draw);
}

