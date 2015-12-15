/**
 * Created by gleicher on 11/29/15.
 */

/** CS559 Image Processing Assignment Framework code
 *
 * This code allows you to load in an image, and then apply image processing operations
 * to it.
 *
 * Define the image processing operations as functions on the list called "processButtons"
 *
 * processButtons should be a list of functions - preferably functions with names
 * (since the function names will be used to make the buttons)
 *
 * Each function takes a single argument - an "ImageData" object and returns an ImageData object
 * for information on ImageData see: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 *
 * The processing function can change things in place, or can create a new ImageData object to return
 *
 */

// if the buttons list doesn't exist create it - but it should have been defined already
    // in another file
var processButtons = processButtons || [];

// the actual guts of the program - makes the buttons and canvas and wires up the callbacks
function setup() {
    var body = document.body;

    // make a DIV to put the controls in
    var controls = document.createElement("div");
    controls.style.border = "1px solid black";
    controls.style.padding = "5px";
    controls.style.marginTop = "5px";
    controls.style.marginBottom = "5px";
    controls.style.display = "block";
    controls.style.width = (512-10) +"px";    // account for padding
    body.appendChild(controls);

    // make a canvas to draw the image into
    // just empty and a plain size for now
    var canvas = document.createElement("canvas");
    canvas.width=100;
    canvas.height=100;
    canvas.style.border = "1px solid blue";
    canvas.style.marginTop = "5px";
    canvas.style.marginBottom = "5px";
    body.appendChild(canvas);

    // handy function to make a button and add it to
    // controls
    function makeButton(name, callback) {
        var button = document.createElement("button");
        button.appendChild(document.createTextNode(name));
        if (callback) {
            button.addEventListener('click', callback, false);
        }
        controls.appendChild(button);
    }

    // keep an image around - this will be the
    // image that we will play around with
    // note: this is loaded (by the button callback)
    // and not changed
    var image = new Image();

    // create a file chooser that will pick the image
    // and load it in
    var fileChooser = document.createElement("input");
    fileChooser.setAttribute("type", "file");
    controls.appendChild(fileChooser);

    // when a file is chosen, read it in and make it be the
    // image
    fileChooser.addEventListener("change", readImage, false);

    function imageHandler(readerevent)
    {
        // note: drawImage wants a processing function
        // not an event
        image.onload = function () { drawImage(); };
        image.src = readerevent.target.result;
    }

    function readImage(inputevent)
    {
        var filename = inputevent.target.files[0];
        var fr = new FileReader();
        fr.onload = imageHandler;
        fr.readAsDataURL(filename);
    }

    fileChooser.addEventListener('change', readImage, false);


    // draws the image to the canvas -
    // note that we need to draw the image first before doing anything
    // if there is an "image processing function" it is applied
    // and these pixels are written over the original
    function drawImage(process)
    {
        // draw the image
        var context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image,0,0);

        // if there is no image, then don't try to process it
        if (image.width && image.height) {

            // if there is a process to apply, get the image
            // and do stuff to it
            if (process) {
                var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                var newImageData = process(imagedata);
                // in the event that the new image is a different size,
                // resize the canvas (warning - this may cause redraw flashes)
                canvas.width = newImageData.width;
                canvas.height = newImageData.height;
                context.putImageData(newImageData, 0, 0);
            }
        }
    }

    // for every function on the list, make a button that calls it appropriately
    if (!processButtons.length) {
        alert("No Image Processing Operations Defined!");
    }
    processButtons.forEach(function(f,i) {
        if (typeof f === "function") {
            console.log("name:" + f.name + " idx:" + i);
            var name = f.name || "function " + i;
            makeButton(name, function () {
                drawImage(f);
            });
        } else {
            console.log("Attempt to add a non-function as a button (index "+i+")");
            alert("Attempt to add non-function as Image-Processing Operation");
        }
    });
}
window.onload = setup;