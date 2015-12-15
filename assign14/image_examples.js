/**
 * Created by gleicher on 11/29/15.
 */


/***
 * Example image processing functions for the CS559 Image Processing Assignment
 *
 * This file sets up a list (called "processButtons") that is used in the file
 * image.js
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
 *
 * Here we create a few example functions and put them onto the processButtons list
 * so that they will be turned into buttons
 */

/**
 * we declare the array - we use the || [] to make the list empty if it hasn't
 * already been defined
 *
  * @type {Array}
 */
var processButtons = processButtons || [];

// Desaturate - makes the colors less colorey.
processButtons.push(
    function desaturate(imageData) {
        var data = imageData.data;
        var desaturation = document.getElementById("desaturation").value;
        // this loops over pixels
        for (var i = 0; i < data.length; i += 4) {
            var red=data[i];
            var green=data[i+1];
            var blue=data[i+2];

            var average = (red + green + blue)/3;

            data[i]   = parseInt((1-desaturation)*red   + desaturation*average);
            data[i+1] = parseInt((1-desaturation)*green + desaturation*average);
            data[i+2] = parseInt((1-desaturation)*blue  + desaturation*average);

        }
        return imageData;
    }
);

//Blur - creates a blur of the image.
//Requires two parameters - a blur strength and radius
processButtons.push(
    function blur(imageData) {
        var data = new Uint8ClampedArray(imageData.data);
        var height = imageData.height;
        var width = imageData.width;

        var radius = document.getElementById("blur_radius").value;
        var strength= document.getElementById("blur_strength").value;

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var red = 0;
                var green = 0;
                var blue = 0;
                //scan all the pixels within a box of size radius
                //so radius is really a bit of a misnomer
                for (var i_offset = -radius; i_offset <= radius; i_offset++) {
                    for (var j_offset = -radius; j_offset <= radius; j_offset++) {
                        if (i_offset + i >= 0 && i_offset + i < width && j_offset + j >= 0 && j_offset + j < height) {
                            red += imageData.data[get_index(imageData, i + i_offset, j + j_offset)];
                            green += imageData.data[get_index(imageData, i + i_offset, j + j_offset) + 1];
                            blue += imageData.data[get_index(imageData, i + i_offset, j + j_offset) + 2];
                        }
                    }
                }
                area = (2*radius + 1) * (2*radius + 1);
                red /= area;
                green /= area;
                blue /= area;

                imageData.data[get_index(imageData, i, j) + 0] = data[get_index(imageData, i, j) + 0] * (1-strength) + red * strength;
                imageData.data[get_index(imageData, i, j) + 1] = data[get_index(imageData, i, j) + 1] * (1-strength) + green*strength;
                imageData.data[get_index(imageData, i, j) + 2] = data[get_index(imageData, i, j) + 2] * (1-strength) + blue* strength;
            }
        }
        return imageData;
    }
);

function get_index(imageData, i, j) {
    return (j * imageData.width + i) * 4;
}

// push another function - this one creates a new image data
// it would probably be better to make one that is the same size
// as the source
processButtons.push(
    function redSquare(imageData) {
        var newData = new ImageData(50,50);
        var data = newData.data;
        // this loops over pixels
        for (var i = 0; i < data.length; i += 4) {
            data[i]   = 255;
            data[i+1] = 128;
            data[i+2] = 128;
            data[i+3] = 255;
        }
        return newData;
    }
);
