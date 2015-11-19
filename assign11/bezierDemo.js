/**
 * Created by gleicher on 11/5/15.
 */

window.onload = function() {
    "use strict";
    var body = document.body;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",600);
    canvas.setAttribute("height",600);
    canvas.style.border = "1px solid";
    body.appendChild(canvas);

    var dw = new DotWindow(canvas, [ [100,300], [100,100], [300,100], [300,300]]);
    dw.userDraw.push(dotWindow_connect);

    body.appendChild(document.createElement("br"));

    function callback() {
        dw.scheduleRedraw();
    }
    dw.userDraw.push(deCastle);

    function deCastle(ctx, dotWindow) {
        var u = Number(button.value)/100.0;
        function deCastleI(lst) {
            var i;
            var newLst = [];
            for (i=0; i<lst.length-1; i++) {
                var ptx = (1-u) * lst[i][0] + u * lst[i+1][0];
                var pty = (1-u) * lst[i][1] + u * lst[i+1][1];
                newLst.push([ptx,pty]);
            }
            if (lst.length) {
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                ctx.beginPath();
                newLst.forEach(function(e,i) {
                    if (i) ctx.lineTo(e[0],e[1]);
                    else ctx.moveTo(e[0],e[1]);
                });
                ctx.stroke();
                ctx.restore();
            }
            newLst.forEach(function(e,i) {
                ctx.save();
                ctx.translate(e[0],e[1]);
                ctx.beginPath();
                ctx.rect(-5,-5,10,10);
                var color = (newLst.length>1) ? "black" : "blue";
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            });
            if (lst.length > 1) {
                deCastleI(newLst);
            }
        }
        deCastleI(dw.points);
    }

    var button = document.createElement("INPUT");
    button.id = "u-value";
    button.setAttribute("type", "range");
    button.style.width = "500px";
    button.min = 0;
    button.max =  100;
    button.value = 50;
    button.addEventListener("input",callback);
    body.appendChild(button);

}