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
  
  gl.bindAttribLocation(shaderProgram, 0, "a_position");
  gl.bindAttribLocation(shaderProgram, 1, "a_normal");




/* TODO: looks like I can stand to lose this.  Let's see if that's true.
  var vertex_shader   = createShaderFromScript(gl, "vert-shader");
  var fragment_shader = createShaderFromScript(gl, "frag-shader");

  //The following (through the next comment specifying otherwise) is a snippet from
  //gl.js - it doesn't allow the customization I need.  See gl.js for attribution information
  var shaderProgram = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
 
  // link the program.
  gl.linkProgram(program);
 
  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }*/


  var vertex_position = gl.getAttribLocation(shaderProgram, "a_position");
  var normal_vector   = gl.getAttribLocation(shaderProgram, "a_normal");
  if (normal_vector == -1) {
    console.log("Shit's fucked.");
  }

  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // now that we have programs to run on the hardware, we can 
  // make our triangle

  // let's define the vertex positions
  var vertexPos = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
  ];  

  gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(vertex_position);
  gl.vertexAttribPointer(vertex_position, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //do the same for normals
  var normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);

  // let's define the normal positions
  var normalVecs = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, normalVecs, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normal_vector);
  gl.vertexAttribPointer(normal_vector, 3, gl.FLOAT, gl.FALSE, 0, 0);


  
  
  // we need to put the vertices into a buffer so we can
  // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 3;


    
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
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
  
start();
