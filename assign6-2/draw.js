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

  // now we have to program the hardware
  // we need to have our GLSL code somewhere
  // putting it in strings is bad - but it's easy so I'll
  // do it for now
  //these shaders are based on the lighting model discussed in class, but are of my own creation
  var vertexSource = ""+
/*"precision highp float;"+
"attribute vec3 position;"+
"attribute vec3 normal;"+
"uniform mat3 normalMatrix;"+
"uniform mat4 modelViewMatrix;"+
"uniform mat4 projectionMatrix;"+
"varying vec3 fNormal;"+

"void main()"+
"{"+
  "fNormal = normalize(normalMatrix * normal);"+
  "vec4 pos = modelViewMatrix * vec4(position, 1.0);"+
  "gl_Position = projectionMatrix * pos;"+
"}";*/
"attribute vec3 position;" +
"void main(void) {" + 
"  gl_Position = vec4(position, 1.0);" +
"}";


  var fragmentSource = "" +
/*"precision highp float;"+
"uniform float time;"+
"uniform vec2 resolution;"+
"varying vec3 fPosition;"+
"varying vec3 fNormal;"+

"vec3 eye_pos = vec3(0.0, 0.0, 1.0);"+
"vec3 specular_light = vec3(0.0, 1.0, 1.0);"+
"vec3 specular_color = vec3(1.0, 0., 0.0);"+
"vec3 halfway = normalize(eye_pos + specular_light);"+
"float shininess = 0.0;"+

"vec3 diffuse_light = vec3(0.0, 1.0, 1.0);"+
"vec3 diffuse_color = vec3(1.0, 0.0, 0.0);"+

"void main()"+
"{"+
"  float specular_shade = pow(dot(fNormal, halfway), shininess);"+
"  float diffuse_shade = dot(diffuse_light, fNormal);"+
  
  
"  float ambient_shade = 0.2;"+
"  vec3 specular_fragcolor = specular_shade*specular_color;"+
"  vec3 diffuse_fragcolor = (diffuse_shade + ambient_shade)*diffuse_color;"+
"  float specularness = 0.5;"+
"  vec3 color = (specular_fragcolor*specularness + diffuse_fragcolor*(1.0-specularness))/(1.0 + ambient_shade);"+
"  gl_FragColor = vec4(color, 1.0);"+
"}";*/
"void main(void) {" +
"  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);" +
"}";
  
  // now we need to make those programs into
  // "Shader Objects" - by running the compiler
  // watch the steps:
  //   create an object
  //   attach the source code
  //   run the compiler
  //   check for errors
  
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

  // OK, we have a pair of shaders, we need to put them together
  // into a "shader program" object
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  
  // now that we have programs to run on the hardware, we can 
  // make our triangle

  // let's define the vertex positions
  var vertexPos = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
   ];  
  
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
