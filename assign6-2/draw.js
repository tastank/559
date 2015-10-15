// Draws a cube
// Author: T. A. Stank
//
//


// The template for this is from one of the class minimal examples.


// draw a triangle using WebGL
// write everything out, step at a time
//
// written by gleicher on October 3, 2015

function start() {
  "use strict";

  // first we need to get the canvas and make an OpenGL context
    // in practice, you need to do error checking
  var canvas = document.getElementById("main_canvas");
    var gl = canvas.getContext("webgl");


  //these shaders are based on the lighting model discussed in class, but are of my own creation
  //I have put shaders in their own files and used a script tag to include them,
  //and a function which does the document.getElementById business (which I borrowed
  //from elsewhere) for me, so there's nothing to do with the shaders here!


  
  // now we need to make those programs into
  // "Shader Objects" - by running the compiler
  // watch the steps:
  //   create an object
  //   attach the source code
  //   run the compiler
  //   check for errors
 /* 
  // first compile the vertex shader
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader,vertexSource);
  gl.compileShader(vertexShader);
  
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(vertexShader));
          return null;
      }
  
  // now compile the fragment shader
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader,fragmentSource);
  gl.compileShader(fragmentShader);
  
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(fragmentShader));
          return null;
      }
*/
  // OK, we have a pair of shaders, we need to put them together
  // into a "shader program" object
//  var shaderProgram = gl.createProgram();
//  gl.attachShader(shaderProgram, vertexShader);
//  gl.attachShader(shaderProgram, fragmentShader);
//  gl.linkProgram(shaderProgram);
//this should do everything the above did, while allowing me to put the shaders
//in separate script files for readability
  var shaderProgram = createProgramFromScripts(gl, "vert-shader", "frag-shader");

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
  //shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
  //gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  

  var attributes = [
    "a_position",
    "a_normal",
    "a_color"
  ];

  gl.bindAttribLocation(shaderProgram, 0, "a_position");
  gl.bindAttribLocation(shaderProgram, 1, "a_normal");
  gl.bindAttribLocation(shaderProgram, 2, "a_color");

  shaderProgram.vertex_position = gl.getAttribLocation(shaderProgram, "a_position");
  shaderProgram.normal_vector   = gl.getAttribLocation(shaderProgram, "a_normal");
  shaderProgram.color           = gl.getAttribLocation(shaderProgram, "a_color");

  gl.enableVertexAttribArray(shaderProgram.vertex_position);
  gl.enableVertexAttribArray(shaderProgram.normal_vector);
  gl.enableVertexAttribArray(shaderProgram.color);

  var num_tris = 2;
  var num_vertices = num_tris*3;

  // now that we have programs to run on the hardware, we can 
  // make our triangle

  // let's define the vertex positions
  var vertexPos = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0,

        -1.0, 1.0, 0.0,
        -1.0, 0.0, 0.0,
        -0.5, 0.0, 0.0
  ];  

  // we need to put the vertices into a buffer so we can
  // block transfer them to the graphics hardware
  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
  vertex_buffer.itemSize = 3;
  vertex_buffer.numItems = num_vertices;
  //I have to do this elsewhere though
  //gl.vertexAttribPointer(shaderProgram.vertex_position, vertex_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);


  //do the same for normals

  // define the normals
  //TODO: actually calculate the normals
  var normalVecs = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,

      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0
  ];

  var normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalVecs), gl.STATIC_DRAW);
  normal_buffer.itemSize = 3;
  normal_buffer.numItems = num_vertices;
  //gl.vertexAttribPointer(shaderProgram.normal_vector, normal_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  var colors = [
    0.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0
  ];

  var color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  color_buffer.itemSize = 3;
  color_buffer.numItems = num_vertices;
  //gl.vertexAttribPointer(shaderProgram.color, color_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  draw();

}




function draw() {    
  // this is the "draw scene" function, but since this 
  // is execute once...
  
    // first, let's clear the screen
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // now we draw the triangle
  // we tell GL what program to use, and what memory block
  // to use for the data, and that the data goes to the pos
  // attribute
  gl.useProgram(shaderProgram);     

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.vertexAttribPointer(shaderProgram.vertex_position, vertex_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.vertexAttribPointer(shaderProgram.normal_vector, normal_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.vertexAttribPointer(shaderProgram.color, color_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  gl.drawArrays(gl.TRIANGLES, 0, vertex_buffer.numItems);
  window.requestAnimationFrame(draw);
}
  
start();
