"use strict"
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
var thecube = new cube(corner1, corner2);
