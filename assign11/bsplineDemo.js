/**
 * Created by gleicher on 11/7/2015.
 */

window.onload = function () {
    "use strict";
    var body = document.body;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",600);
    canvas.setAttribute("height",600);
    canvas.style.border = "1px solid";
    body.appendChild(canvas);

    var basePts = [ [100,300], [100,100], [300,100], [300,300]];
    var rounds = [];

    var dw = new DotWindow(canvas, basePts);

    function addRound() {
        var start = (rounds.length) ? rounds[rounds.length-1] : dw.points;
        var roundN = rounds.length;
        var repls = 2;
        var avgs = Number(uiMode.value);
        var ct;

        var replicate = [];
        start.forEach(function(pt) {
            for (ct=0; ct<repls; ct++ ) {
                replicate.push(pt);
            }
        });
        for(ct=0; ct<avgs; ct++) {
            var smooth = [];
            var i;
            for (i=0; i<replicate.length-1; i++) {
                smooth.push([
                    (replicate[i][0]+replicate[i+1][0])/2,
                    (replicate[i][1]+replicate[i+1][1])/2
                            ]);
            }
            replicate = smooth;

        }
        rounds.push(replicate);
        dw.scheduleRedraw();
    }

    function callback() {
        rounds = [];
        dw.scheduleRedraw();
    }
    dw.onChange.push(callback);

    dw.userDraw.push(function(ctx,dotWindow) {
        function drawRound(round, roundI) {
            var color = (roundI == rounds.length - 1) ? "red" : "blue";
            round.forEach(function (point) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(point[0], point[1]);
                ctx.beginPath();
                ctx.rect(-4, -4, 8, 8);
                ctx.fill();
                ctx.restore();
            })
        }
        if (rounds.length) {
            var allRounds = false;

            if (allRounds) rounds.forEach(drawRound);
            else drawRound(rounds[rounds.length - 1], rounds.length - 1);
            ctx.save();
            ctx.strokeStyle = "red";
            ctx.beginPath();
            rounds[rounds.length - 1].forEach(function (pt, i) {
                if (i) {
                    ctx.lineTo(pt[0], pt[1]);
                }
                else {
                    ctx.moveTo(pt[0], pt[1]);
                }
            });
            ctx.stroke();
            ctx.restore();
        }
    });


    body.appendChild(document.createElement("BR"));
    var btn = document.createElement("button");
    btn.innerHTML = "Add Round";
    btn.onclick = addRound;
    body.appendChild(btn);

    var uiMode = document.createElement("select");
    uiMode.innerHTML += "<option>1</option>";
    uiMode.innerHTML += "<option>2</option>";
    uiMode.innerHTML += "<option>3</option>";
    uiMode.innerHTML += "</select>";
    uiMode.value = "3";
    uiMode.onchange = callback;
    uiMode.on
    body.appendChild(uiMode);

}