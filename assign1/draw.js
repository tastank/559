"use strict"
var canvas = document.getElementById('main_canvas');
var path = canvas.getContext('2d');

//sky
path.beginPath();
path.moveTo(0, 240);
path.lineTo(640, 240);
path.lineTo(640, 0);
path.lineTo(0,0);
path.lineTo(0, 240);
path.fillStyle = "#99ddff";
path.fill();

//grass
path.beginPath();
path.moveTo(0, 240);
path.lineTo(640, 240);
path.lineTo(640, 480);
path.lineTo(0, 480);
path.lineTo(0, 240);
path.fillStyle = "#55ff55";
path.fill();

//shoulder
path.beginPath();
path.moveTo(0,480);
path.lineTo(320, 240);
path.lineTo(640, 480);
path.lineTo(600, 480);
path.lineTo(320, 240);
path.lineTo(40, 480);
path.lineTo(0, 480);
path.fillStyle = "#ffddaa";
path.fill();

//road
path.beginPath();
path.moveTo(40, 480);
path.lineTo(320, 240);
path.lineTo(600, 480);
path.lineTo(40, 480);
path.fillStyle = "#aaaaaa";
path.fill();

//lines
path.beginPath();
path.moveTo(300, 480);
path.lineTo(320, 240);
path.lineTo(340, 480);
path.lineTo(327, 480);
path.lineTo(320, 240);
path.lineTo(313, 480);
path.lineTo(300, 480);
path.fillStyle = "#ffff00";
path.fill();

//signpost
path.beginPath();
path.moveTo(490, 360);
path.lineTo(490, 260);
path.lineTo(500, 260);
path.lineTo(500, 360);
path.lineTo(490, 360);
path.fillStyle = "#dddddd";
path.fill();

//sign background
path.beginPath();
path.moveTo(470, 270);
path.lineTo(520, 270);
path.lineTo(520, 200);
path.lineTo(470, 200);
path.lineTo(470, 270);
path.fillStyle = "#ffffff";
path.fill();

//face
path.beginPath();
path.arc(495, 235, 20, 0, 2*Math.PI);
path.fillStyle = "#ffff00";
path.fill();

//left eye
path.beginPath();
path.arc(488, 228, 5, 0, 2*Math.PI);
path.fillStyle = "#000000";
path.fill();

//right eye
path.beginPath();
path.arc(502, 228, 5, 0, 2*Math.PI);
path.fill();

//smile
path.beginPath();
path.arc(495, 235, 15, 0, Math.PI);
path.stroke();

//text
path.beginPath();
path.font = "12px Arial";
path.fillStyle = "#000000";
path.textAlign = "center";
path.fillText("Drive", 495, 212);
path.fillText("Safe!", 495, 268);
