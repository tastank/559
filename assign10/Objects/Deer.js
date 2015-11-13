/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Deer = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;
    var image = new Image();
    image.src = "textures/deer.png";
    var bump_image = new Image();
    bump_image.src = "textures/deer_bump.png";

    // constructor for Cubes
    Deer = function Deer(name, position, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.texture = null;
        this.bump_texture = null;
    }
    Deer.prototype.init = function(drawingState) {
        this.texture = createGLTexture(drawingState.gl, image, true);
        this.bump_texture = createGLTexture(drawingState.gl, bump_image, true);
        var gl=drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["obj-vs", "obj-fs"]);
        }
        if (!buffers) {
            var all_arrays = makeArraysFromOBJ("Deer.obj", true);
            var arrays = {
                a_pos: { numComponents: 3, data: all_arrays.vpos.data},
                a_texcoord: {numComponents: 2, data: all_arrays.vtex.data},
                a_normal: {numComponents: 3, data: all_arrays.vnormal.data}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };



    Deer.prototype.draw = function(drawingState) {
        drawingState.gl.activeTexture(drawingState.gl.TEXTURE0);
        drawingState.gl.bindTexture(drawingState.gl.TEXTURE_2D, this.texture);
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            //it's a deer
            u_specularness: 0.0,
            u_shininess:    0.0,
            u_emittance:    0.0,
            u_emittance_color:  drawingState.sunColor,
            u_texture:      this.texture,
            u_bumpmap:      this.bump_texture,
            u_view:drawingState.view,
            u_proj:drawingState.proj,
            u_lightdir:drawingState.sunDirection,
            u_suncolor:drawingState.sunColor,
            u_sunlight: drawingState.sunlight,
            u_model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Deer.prototype.center = function(drawingState) {
        return this.position;
    }


})();

grobjects.push(new Deer("deer0",[0, 1, 0], 8.0) );
