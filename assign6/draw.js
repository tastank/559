// Draws a cube
// Author: T. A. Stank
//
//

var x_slider = document.getElementById('x_slider');
var y_slider = document.getElementById('y_slider');
var z_slider = document.getElementById('z_slider');
var xrot_slider = document.getElementById('xrot_slider');
var yrot_slider = document.getElementById('yrot_slider');
var zrot_slider = document.getElementById('zrot_slider');
var speed_slider = document.getElementById('speed_slider');
var sort_slider = document.getElementById('sort_slider');
var wireframe_slider = document.getElementById('wireframe_slider');





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
  gl.useProgram(shaderProgram);     

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
  //shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
  //gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  

  var attributes = [
    "a_position",
    "a_normal",
    "a_color"
  ];

  var uniforms = [
    "u_normal_matrix",
    "u_modelview_matrix",
    "u_projection_matrix"
  ];

/*Turns out this isn't necessary
  gl.bindAttribLocation(shaderProgram, 0, "a_position");
  gl.bindAttribLocation(shaderProgram, 1, "a_normal");
  gl.bindAttribLocation(shaderProgram, 2, "a_color");
*/

  shaderProgram.vertex_position = gl.getAttribLocation(shaderProgram, "a_position");
  shaderProgram.normal_vector   = gl.getAttribLocation(shaderProgram, "a_normal");
  shaderProgram.color           = gl.getAttribLocation(shaderProgram, "a_color");

  gl.enableVertexAttribArray(shaderProgram.vertex_position);
  gl.enableVertexAttribArray(shaderProgram.normal_vector);
  gl.enableVertexAttribArray(shaderProgram.color);

  shaderProgram.normal_matrix     = gl.getUniformLocation(shaderProgram, "u_normal_matrix");
  shaderProgram.modelview_matrix  = gl.getUniformLocation(shaderProgram, "u_modelview_matrix");
  shaderProgram.projection_matrix = gl.getUniformLocation(shaderProgram, "u_projection_matrix");


  // now that we have programs to run on the hardware, we can 
  // make our triangle

  // let's define the vertex positions


  var vertexPos = [];
  var normalVecs = [];
  var colors = [];

  var cube = new Rprism(new Point(-1, -1, -1), new Point(1, 1, 1));
  var tris = cube.getTris();

  var num_tris = tris.length;
  var num_vertices = num_tris*3;
  
  for (var i = 0; i < tris.length; i++) {
    vertexPos  = vertexPos.concat(tris[i].getVertexArray());
    //do for each vertex
    normalVecs = normalVecs.concat(tris[i].getNormal());
    normalVecs = normalVecs.concat(tris[i].getNormal());
    normalVecs = normalVecs.concat(tris[i].getNormal());

    //also for each vertex
    colors = colors.concat([1.0, 1.0, 1.0]);
    colors = colors.concat([1.0, 1.0, 1.0]);
    colors = colors.concat([1.0, 1.0, 1.0]);
  }
  

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
  var normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalVecs), gl.STATIC_DRAW);
  normal_buffer.itemSize = 3;
  normal_buffer.numItems = num_vertices;
  //gl.vertexAttribPointer(shaderProgram.normal_vector, normal_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  var y_angle = 0;

  var color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  color_buffer.itemSize = 3;
  color_buffer.numItems = num_vertices;
  //gl.vertexAttribPointer(shaderProgram.color, color_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

  var m4 = twgl.m4;
  var v3 = twgl.v3;

  //set up our transformation matrices

  //why don't I have functions like gl_frustum provided by OpenGL?  This is lame.
  //TWGL to the rescue!
  var projection_matrix = m4.perspective(90*Math.PI/180, 1, 0.1, 10);
  //to be honest, I'm not sure what transformations to apply to these.
  //var modelview_matrix  = m4.identity();
  var modelview_matrix = m4.inverse(m4.lookAt(
    [0.0, 0.0, 3.0],
    [0.0, 0.0, -1.0],
    [0.0, 1.0, 0.0]
  ));
  var normal_matrix     = m4.identity();


  function draw() {    
    var x_pos = x_slider.value;
    var y_pos = y_slider.value;
    var z_pos = z_slider.value;
    var x_rot = xrot_slider.value;
    var y_rot = yrot_slider.value;
    var z_rot = zrot_slider.value;
    var look_x = lookx_slider.value;
    var look_y = looky_slider.value;
    var speed = speed_slider.value;
    // this is the "draw scene" function, but since this 
    // is execute once...
    
    // first, let's clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //this feels a bit hacky, but I want the camera to move without changing direction
    var projection_matrix = m4.perspective(90*Math.PI/180, 1, 0.1, 10);
    projection_matrix = m4.translate(projection_matrix, [-x_pos, -y_pos, z_pos]);

    y_angle = -(-y_angle - speed);

    modelview_matrix = m4.inverse(m4.lookAt(
      [0.0, 0.0, 3.0],
      //[0.0, 0.0, 3.0],
      [look_x, look_y, -1.0],
      [0.0, 1.0, 0.0]
    ));
    modelview_matrix = m4.rotateX(modelview_matrix, x_rot);
    modelview_matrix = m4.rotateY(modelview_matrix, -(-y_rot - y_angle));
    modelview_matrix = m4.rotateZ(modelview_matrix, z_rot);

    var normal_matrix     = m4.identity();
    normal_matrix = m4.rotateX(normal_matrix, x_rot);
    normal_matrix = m4.rotateY(normal_matrix, -(-y_rot - y_angle));
    normal_matrix = m4.rotateZ(normal_matrix, z_rot);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.vertexAttribPointer(shaderProgram.vertex_position, vertex_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.vertexAttribPointer(shaderProgram.normal_vector, normal_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(shaderProgram.color, color_buffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    gl.uniformMatrix4fv(shaderProgram.projection_matrix, gl.FALSE, projection_matrix);
    gl.uniformMatrix4fv(shaderProgram.modelview_matrix,  gl.FALSE, modelview_matrix);
    gl.uniformMatrix4fv(shaderProgram.normal_matrix,     gl.FALSE, normal_matrix);

    gl.drawArrays(gl.TRIANGLES, 0, vertex_buffer.numItems);

    //firefox keeps optimizing out my variables.  some optimizer they've got.
    NOP(normalVecs);
    NOP(colors);
    NOP(vertexPos);

    window.requestAnimationFrame(draw);

  };

  draw();
  
}

function NOP() {}
