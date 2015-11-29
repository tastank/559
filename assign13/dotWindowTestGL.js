/**
 * Created by gleicher on 11/9/2015.
 */

window.onload = function() {
    "use strict";
    var body = document.body;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",600);
    canvas.setAttribute("height",600);
    canvas.style.border = "1px solid";
    body.appendChild(canvas);

    var dw = new DotWindow(canvas, [ [100,100], [100,300], [300,350], [300,100]], "webgl");
    dw.userDraw.push(dotWindow_connectGL);
}