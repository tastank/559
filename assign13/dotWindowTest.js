/**
 * Created by gleicher on 11/5/15.
 */


window.onload = function() {
    "use strict";
    var body = document.body;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",400);
    canvas.setAttribute("height",400);
    canvas.style.border = "1px solid";
    body.appendChild(canvas);

    var dw = new DotWindow(canvas, [ [100,100], [100,300], [300,350], [300,100]]);
    dw.userDraw.push(dotWindow_connect);
}