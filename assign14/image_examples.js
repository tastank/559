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

//Scales the image by a factor of two using bilinear sampling
processButtons.push(
    function scaleup(imageData) {
        var data = new ImageData(2*imageData.width, 2*imageData.height);
        for (var i = 0; i < imageData.width; i++) {
            for (var j = 0; j < imageData.height; j++) {
                var red1, green1, blue1;
                red1 = imageData.data[get_index(imageData, i, j)];
                green1 = imageData.data[get_index(imageData, i, j)+1];
                blue1 = imageData.data[get_index(imageData, i, j)+2];
                //get other pixel values for bilinear sampling
                for (var i_offset = 0; i_offset < 2; i_offset++) {
                    for (var j_offset = 0; j_offset < 2; j_offset++) {
                        var red2, green2, blue2;
                        var i_inc = i_offset;
                        var j_inc = j_offset;
                        //prevent overflow
                        if (i + i_offset == imageData.width) {
                            i_inc = 0;
                        }
                        if (j + j_offset == imageData.height) {
                            j_inc = 0;
                        }
                        red2 = imageData.data[get_index(imageData, i + i_inc, j + j_inc)];
                        green2 = imageData.data[get_index(imageData, i + i_inc, j + j_inc) + 1];
                        blue2 = imageData.data[get_index(imageData, i + i_inc, j + j_inc) + 2];
                        var interp_red = (red1 + red2) / 2;
                        var interp_green = (green1 + green2) / 2;
                        var interp_blue = (blue1 + blue2) / 2;
                        data.data[get_index(data, 2*i + i_inc, 2*j + j_inc)] = parseInt(interp_red);
                        data.data[get_index(data, 2*i + i_inc, 2*j + j_inc) + 1] = parseInt(interp_green);
                        data.data[get_index(data, 2*i + i_inc, 2*j + j_inc) + 2] = parseInt(interp_blue);
                        data.data[get_index(data, 2*i + i_inc, 2*j + j_inc) + 3] = 255;
                    }
                }
            }
        }
        return data;
    }
);

//Scales the image by a factor of 1/2 using bilinear sampling
processButtons.push(
    function scaledown(imageData) {
        var data = new ImageData(parseInt(0.5*imageData.width), parseInt(0.5*imageData.height));
        for (var i = 0; i < data.width; i++) {
            for (var j = 0; j < data.height; j++) {
                var red = 0;
                var green = 0;
                var blue = 0;
                //get other pixel values for bilinear sampling
                for (var i_offset = 0; i_offset < 2; i_offset++) {
                    for (var j_offset = 0; j_offset < 2; j_offset++) {
                        var red2, green2, blue2;
                        var i_inc = i_offset;
                        var j_inc = j_offset;
                        //prevent overflow
                        if (i + i_offset == imageData.width) {
                            i_inc = 0;
                        }
                        if (j + j_offset == imageData.height) {
                            j_inc = 0;
                        }
                        red += imageData.data[get_index(imageData, 2*i + i_inc, 2*j + j_inc)];
                        green += imageData.data[get_index(imageData, 2*i + i_inc, 2*j + j_inc) + 1];
                        blue += imageData.data[get_index(imageData, 2*i + i_inc, 2*j + j_inc) + 2];
                    }
                }
                red /= 4;
                green /= 4;
                blue /= 4;

                data.data[get_index(data, i, j)] = parseInt(red);
                data.data[get_index(data, i, j) + 1] = parseInt(green);
                data.data[get_index(data, i, j) + 2] = parseInt(blue);
                data.data[get_index(data, i, j) + 3] = 255;
            }
        }
        return data;
    }
);
