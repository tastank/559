"use strict"
var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');

var prop_angle = 0.0;
var bank_angle = 0.0;
var target_bank = 0.0;
var bank_slider;
var pitch_angle = 0.0;
var target_pitch = 0.0;
var pitch_slider;
var airspeed = 150;
var target_airspeed = 150;
var altitude = 3000;
var heading = 0;
var power_slider;
var fuse_width = 50;
var wingspan = 500;

bank_slider = document.getElementById('bank_slider');
pitch_slider = document.getElementById('pitch_slider');
power_slider = document.getElementById('power_slider');



//global, if you will, settings for the HUD
var hud_color = "#00c000";
var hud_tape_font = "8px Courier";
var hud_val_font = "12px Courier";
var hud_lineCap = "round";



function draw() {
    ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);

    ctx.save();
    //I'm done with these upside-down vertical coordinates
    ctx.scale(1,-1);
    ctx.translate(0, -480);

    ctx.save();
    ctx.translate(320, -pitch_angle*600 - altitude*0.01);
    ctx.rotate(bank_angle);
    draw_world();
    ctx.restore();

    ctx.save();
    ctx.translate(320, 200);
    draw_airplane();
    ctx.restore();

    ctx.save();
    ctx.translate(320,240);
    draw_hud();
    ctx.restore();
    ctx.restore();

    update();
    window.requestAnimationFrame(draw);
}


function draw_world() {
    ctx.beginPath();
    ctx.moveTo(-1000, 200);
    ctx.lineTo(1640, 200);
    ctx.stroke();
    ctx.lineTo(1640, 680);
    ctx.lineTo(-1000, 680);
    ctx.lineTo(-1000, 200);
    ctx.fillStyle = "#99ddff";
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-1000, 200);
    ctx.lineTo(1640, 200);
    ctx.stroke();
    ctx.lineTo(1640, -1000);
    ctx.lineTo(-1000, -1000);
    ctx.lineTo(-1000, 200);
    ctx.fillStyle = "#55ff55";
    ctx.fill();
}




function draw_airplane() {
    ctx.save()
    ctx.translate(0, 30);
    ctx.rotate(prop_angle);
    draw_propeller();
    ctx.restore();

    ctx.save();
    draw_wing(1);
    ctx.scale(-1, 1);
    draw_wing(-1);
    ctx.restore();

    ctx.save();
    draw_fuse_half();
    ctx.scale(-1, 1);
    draw_fuse_half();
    ctx.restore();

}

function draw_fuse_half() {
    //underside
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(fuse_width/2, 0);
    ctx.lineTo(2, 15);
    //if not -1, there appears to be a gap in the middle
    ctx.lineTo(-1, 15);
    ctx.moveTo(-1, 0);
    ctx.fillStyle = "#cc0000";
    ctx.stroke();
    ctx.fill();

    //side
    ctx.beginPath();
    ctx.moveTo(fuse_width/2, 0);
    ctx.lineTo(2, 15);
    ctx.lineTo(2, 40);
    ctx.lineTo(fuse_width/2, 50);
    ctx.lineTo(fuse_width/2, 0);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.stroke();

    //top
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(fuse_width/2, 50);
    ctx.lineTo(2, 40);
    ctx.lineTo(0, 50 + fuse_width/2);
    ctx.arc(0, 50, fuse_width/2, 0, Math.PI/2);
    ctx.stroke();
    ctx.fill();

    //rudder
    ctx.beginPath();
    ctx.moveTo(0,15);
    ctx.lineTo(0, 100);
    ctx.lineTo(2.5, 100);
    ctx.lineTo(2.5, 15);
    ctx.lineTo(0, 15);
    ctx.fill();
    ctx.stroke();

    //horiz stab
    ctx.beginPath();
    ctx.moveTo(5,25);
    ctx.lineTo(100, 25);
    ctx.lineTo(100, 30);
    ctx.lineTo(5, 30);
    ctx.lineTo(5, 25);
    ctx.fill();
    ctx.moveTo(5,27.5);
    ctx.lineTo(100, 27.5);
    ctx.stroke();

}

function draw_wing() {
    //todo: colors!
    ctx.beginPath();
    ctx.moveTo(fuse_width / 2, 0);
    ctx.lineTo(wingspan / 2 - 10, 15);
    ctx.lineTo(wingspan/2, 25);
    ctx.lineTo(fuse_width / 2, 15);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.moveTo(fuse_width/2, 7.5);
    ctx.lineTo(wingspan/2 - 5, 20);
    ctx.stroke();
}

function draw_propeller() {
    ctx.save();
    ctx.rotate(prop_angle);
    draw_blade();
    ctx.rotate(2* Math.PI / 3);
    draw_blade();
    ctx.rotate(2* Math.PI / 3);
    draw_blade();
    ctx.restore();
}

function draw_blade() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-4, 15);
    ctx.lineTo(-4, 60);
    ctx.lineTo(4, 60);
    ctx.lineTo(4, 15);
    ctx.moveTo(0, 0);
    ctx.fillStyle = "#222222";
    ctx.fill();
    ctx.stroke();
/*    ctx.translate(4, -15);
    ctx.arc(30*Math.sqrt(3)-4, 30, 120, 5*Math.PI/6, 7*Math.PI/6);
    ctx.stroke();
    ctx.translate(-4, 15);*/
}


function draw_hud() {
    ctx.fillStyle = hud_color;
    ctx.strokeStyle = hud_color;
    ctx.lineCap = hud_lineCap;

    //the bars inside the airspeed/altitude tape
    ctx.save();
    draw_tape_box();
    ctx.scale(-1, 1);
    draw_tape_box();
    ctx.restore();

    draw_airspeed();
    draw_altitude();

    draw_airspeed_tape();
    draw_altitude_tape();

    draw_dg();

    draw_hud_horizon();

    ctx.lineWidth = 1;

}

function draw_tape_box() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(-300, -150);
    ctx.lineTo(-250, -150);
    ctx.lineTo(-250, 150);
    ctx.lineTo(-300, 150);

    ctx.moveTo(-300, -10);
    ctx.lineTo(-260, -10);
    ctx.lineTo(-260, -5);
    ctx.lineTo(-250, 0);
    ctx.lineTo(-260, 5);
    ctx.lineTo(-260, 10);
    ctx.lineTo(-300, 10);
    ctx.lineTo(-300, -10);
    ctx.stroke();
}

function draw_airspeed_tape() {
    //assure these are divisible by ten
    var max_airspeed = parseInt((airspeed + 49) / 10) * 10;
    var min_airspeed = parseInt((airspeed - 40) / 10) * 10;
    var tape_delta = 10;
    var num_delta = 2*tape_delta;

    ctx.save();
    ctx.translate(-250, 0);
    ctx.beginPath();
    var i_speed;
    for (i_speed = min_airspeed; i_speed <= max_airspeed; i_speed += tape_delta) {
        if (i_speed - airspeed > 5 || airspeed - i_speed > 5) {
            //I want this to look a /little/ jerky as it moves
            var tape_y = 3 * parseInt(i_speed - airspeed);
            ctx.moveTo(0, tape_y);
            ctx.lineTo(-20, tape_y);


            if (i_speed % num_delta === 0) {
                //draw number
                draw_tape_text(parseInt(i_speed), -25, tape_y-3, "right");
            }
        }
    }
    ctx.stroke();
    ctx.restore();
}

function draw_altitude_tape() {
    //assure these are divisible by 100
    var max_altitude = parseInt((altitude + 490) / 100) * 100;
    var min_altitude = parseInt((altitude - 400) / 100) * 100;
    var tape_delta = 100;
    var num_delta = 2*tape_delta;

    ctx.save();
    ctx.translate(250, 0);
    ctx.beginPath();
    var i_alt;
    for (i_alt = min_altitude; i_alt <= max_altitude; i_alt += tape_delta) {
        if (i_alt - altitude > 50 || altitude - i_alt > 50) {
            //I want this to look a /little/ jerky as it moves
            var tape_y = 3 * parseInt(i_alt - altitude)/10;
            ctx.moveTo(0, tape_y);
            ctx.lineTo(20, tape_y);


            if (i_alt % num_delta === 0) {
                //draw number
                draw_tape_text(parseInt(i_alt), 25, tape_y-3, "left");
            }
        }
    }
    ctx.stroke();
    ctx.restore();
}

function draw_tape_text(text, x, y, align) {
    ctx.save()
    ctx.fillStyle = hud_color;
    ctx.font = hud_tape_font;
    ctx.textAlign = align;
    draw_text(text, x, y);
    ctx.restore();
}

function draw_text(text, x, y) {
    ctx.save();
    ctx.translate(x, y);
    //flip the text so it's upright
    ctx.scale(1, -1);
    //the + 0.5 causes it to round up when appropriate
    ctx.fillText(text, 0, 0);
    ctx.strokeText(text, 0, 0);
    ctx.restore();
}

function draw_airspeed() {
    //flip the text so it's upright
    ctx.font = hud_val_font;
    ctx.fillStyle = hud_color;
    ctx.strokeStyle = hud_color;
    ctx.textAlign = "right";
    draw_text(parseInt(airspeed + 0.5), -270, -4);
}

function draw_altitude() {
    ctx.font = hud_val_font;
    ctx.strokeStyoe = hud_color;
    ctx.fillStyle = hud_color;
    ctx.textAlign = "right";
    draw_text(parseInt(altitude), 300, -4);
}

function draw_dg() {

    ctx.save();

    ctx.translate(0, -250);
    //draw index
    ctx.beginPath();
    ctx.moveTo(-5, 120);
    ctx.lineTo(5, 120);
    ctx.lineTo(0, 105);
    ctx.lineTo(-5, 120);

    ctx.rotate(heading * Math.PI/180);

    ctx.font = hud_tape_font;
    ctx.fillStyle = hud_color;
    ctx.strokeStyle = hud_color;
    ctx.textAlign = "center";
    for (var i = 0; i < 360; i += 10) {
        ctx.moveTo(0, 100);
        ctx.lineTo(0, 80);
        if (i % 30 === 0) {
            draw_text(parseInt(i), 0, 70);
        }
        ctx.rotate(-Math.PI/18);
    }
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(0, -120);
    draw_heading();
    ctx.restore();
}

function draw_heading() {
    ctx.textAlign = "center";
    ctx.font = hud_val_font;
    ctx.fillStyle = hud_color;
    ctx.strokeStyle = hud_color;
    ctx.beginPath();
    ctx.moveTo(-20, -6);
    ctx.lineTo(20, -6);
    ctx.lineTo(20, 6);
    ctx.lineTo(-20, 6);
    ctx.lineTo(-20, -6);
    ctx.stroke();
    draw_text(parseInt(heading), 0, -4);
}


function draw_hud_horizon() {
    //center icon
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(-50, 0);
    ctx.lineTo(-10, 0);
    ctx.lineTo(0, -10);
    ctx.lineTo(10, 0);
    ctx.lineTo(50, 0);
    ctx.stroke();

    ctx.lineWidth = 1;



    ctx.font = hud_tape_font;
    ctx.textAlign = "center";
    var pitch_degrees = pitch_angle * 180/Math.PI;
    ctx.translate(0, -pitch_degrees*5);
    ctx.rotate(bank_angle);

    //assure these are divisible by 100
    var max_pitch = parseInt((pitch_degrees + 35) / 10) * 10;
    var min_pitch = parseInt((pitch_degrees - 25) / 10) * 10;
    var tape_delta = 10;
    var num_delta = tape_delta;

    for (var i = min_pitch; i < 0 && i < max_pitch; i += tape_delta) {
        var tape_y = i * 5;
        ctx.save();
        ctx.translate(0, tape_y);
        draw_text(parseInt(i), 0, -3);
        draw_neg_pitch_mark();
        ctx.scale(-1, 1);
        draw_neg_pitch_mark();
        ctx.restore();
    }
    if (max_pitch >= 0 && min_pitch <= 0) {
        ctx.beginPath();
        ctx.moveTo(-150, 0);
        ctx.lineTo(150, 0);
        ctx.stroke();
    }
    for (var i = tape_delta; i < max_pitch; i += tape_delta) {
        var tape_y = i * 5;
        ctx.save();
        ctx.translate(0, tape_y);
        draw_text(parseInt(i), 0, -3);
        draw_pos_pitch_mark();
        ctx.scale(-1, 1);
        draw_pos_pitch_mark();
        ctx.restore();
    }
}

function draw_neg_pitch_mark() {
    ctx.strokeStyle = hud_color;
    ctx.fillStyle = hud_color;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(40, 0);
    ctx.moveTo(50, 0);
    ctx.lineTo(70, 0);
    ctx.moveTo(80, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(100, 20);
    ctx.stroke();
}
function draw_pos_pitch_mark() {
    ctx.strokeStyle = hud_color;
    ctx.fillStyle = hud_color;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(100, -20);
    ctx.stroke();
}

function update() {
    var prop_speed = 0.1 + power_slider.value * 0.001 + airspeed * 0.0001;
    //this is America, our propellers spin clockwise
    prop_angle -= prop_speed;
    var bank_delta = .005
    var bank_epsilon = .004;
    var pitch_delta = .001;
    var pitch_epsilon = .002;
    var airspeed_delta = 0.2;
    var airspeed_epsilon = 0.3;

    target_airspeed = (power_slider.value - pitch_angle * 600);
    //JS likes to treat + as concatenation because that definitely makes more sense than addition
    target_pitch = pitch_slider.value - (150 - airspeed) / 800;
    target_bank = bank_slider.value;

    if      (target_bank - bank_angle >  bank_epsilon) bank_angle += bank_delta;
    else if (target_bank - bank_angle < -bank_epsilon) bank_angle -= bank_delta;
    if      (target_pitch - pitch_angle >  pitch_epsilon) pitch_angle += pitch_delta;
    else if (target_pitch - pitch_angle < -pitch_epsilon) pitch_angle -= pitch_delta;
    if      (target_airspeed - airspeed >  airspeed_epsilon) airspeed += airspeed_delta;
    else if (target_airspeed - airspeed < -airspeed_epsilon) airspeed -= airspeed_delta;

    altitude += (((pitch_angle)*200 +  (power_slider.value - 150) )) * airspeed * 0.0001;
    //this gives a roughly 2*standard rate turn at default pitch/power setting and max bank
    heading += bank_angle / airspeed * 50;
    if (heading > 360) heading -= 360;
    else if (heading < 0) heading += 360;
}

draw();
