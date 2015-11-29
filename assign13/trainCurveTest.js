/**
 * Created by gleicher on 11/6/15.
 */

/* 559 Train Sample Code
    Note: this is not complete. The actual guts of the project are in another file.
    This code will not run!
    However, it is provided to students so they can get a sense of how to
    use the DotWindow and TrainTimeController objects.
 */

// make a checkbox - put a label next to it (so it all goes into a div)
// note: this returns the checkbox - not the containing div
// this will add the DIV as a child of the thing passed as "appendTo"
function makeCheckBox(name, appendTo, callback) {
    var span = document.createElement("SPAN");
    var label = document.createTextNode(name);
    var button = document.createElement("INPUT");
    span.appendChild(button);
    span.appendChild(label);

    span.style.width = '150px';
    span.style.display = "inline-block";

    button.setAttribute("type", "checkbox");
    button.checked = false;
    if (callback) button.addEventListener("change",callback);

    if (appendTo) appendTo.appendChild(span);
    return button;
}

//
window.onload = function() {
    "use strict";
    var body = document.body;
    var width = 600;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",width);
    canvas.setAttribute("height",width);
    canvas.style.border = "1px solid";
    body.appendChild(canvas);

    //
    // the important part: set up the two main things in the train
    var ttc = new TrainTimeController(width,body,4);
    var dw = new DotWindow(canvas, [ [100,300], [100,100], [300,100], [300,300]]);

    var cc = new CurveCache();
    cc.control_points = dw.points;
    cc.resample();

    // control panel
    // this sets up a control panel that has various things for alterning parameters
    var controls = document.createElement("div");
    controls.style.border = "1px solid black";
    controls.style.padding = "5px";
    controls.style.marginTop = "5px";
    controls.style.marginBottom = "5px";
    controls.style.display = "block";
    controls.style.width = (width-10) +"px";    // account for padding
    body.appendChild(controls);
    function cb() { dw.scheduleRedraw();}
    var arclen = makeCheckBox("ArcLength",controls,cb);
    var asDots = makeCheckBox("AsDots",controls,cb);

    // this wires the pieces together
    // when a dot is changed, recompute the curve (and make sure the timeline is right)
    // when the time changes, redraw (so the train moves)
    dw.onChange.push(function(dw) {cc.resample(); ttc.setMax(dw.points.length)});
    ttc.onchange.push(function() {dw.scheduleRedraw();});

    // this draws the train and track
    dw.userDraw.push(function(ctx,dotWindow) {
        if (asDots.checked) {
            cc.samples.forEach(function (e, i) {
                ctx.save();
                ctx.translate(e[0], e[1]);
                ctx.beginPath();
                ctx.rect(-2, -2, 4, 4);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.restore();
            });
        } else {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.linewidth = 2;
            ctx.beginPath();
            var last = cc.samples.length-1;
            ctx.moveTo(cc.samples[last][0],cc.samples[last][1]);
            cc.samples.forEach(function (e, i) {
                ctx.lineTo(e[0],e[1]);
            });
            ctx.stroke();
            ctx.restore();

            for (var u = 0; u < cc.control_points.length; u += 0.1) {
                ctx.save();
                ctx.beginPath();
                var point = cc.eval(cc.arclenToU(u));
                ctx.translate(point[0], point[1]);
                var dir = cc.eval_dir(cc.arclenToU(u));
                var track_scale = 5;
                ctx.moveTo(dir[1] * track_scale, -dir[0] * track_scale);
                ctx.lineTo(-dir[1] * track_scale, dir[0] * track_scale);
                ctx.stroke();
                ctx.restore();
            }
        }

        var t = ttc.getTime();
        //in pixels
        var train_length = 60;
        //in t-units
        var train_delta = 0.2;
        var train_width = 12;
        var pos_rear = cc.eval(arclen.checked ? cc.arclenToU(t, true) : t);
        var pos_front = cc.eval(arclen.checked ? cc.arclenToU(t + train_delta, true) : t + train_delta);
        var pos = [];
        //because of the limitations of our drawing functions, we have to draw the train as a vertical rectangle
        //then rotate it about its middle.
        pos.push((pos_rear[0] + pos_front[0])/2);
        pos.push((pos_rear[1] + pos_front[1])/2);
        //the rotation is a bit tricky - we'll have to use inverse trig functions on a normalized direction vector
        var x_dir = pos_front[0] - pos_rear[0];
        var y_dir = pos_front[1] - pos_rear[1];
        var norm_scale = Math.sqrt(x_dir*x_dir + y_dir*y_dir);
        x_dir /= norm_scale;
        var angle = Math.asin(x_dir);
        if (y_dir < 0) angle *= -1;

        ctx.save();
        ctx.translate(pos[0],pos[1]);
        ctx.rotate(-angle);
        ctx.beginPath();
        ctx.rect(-train_width/2,-train_length/2,train_width,train_length);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    });
}
