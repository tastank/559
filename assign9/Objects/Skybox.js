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
var Skybox = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;
    var image = new Image();
    image.src = "textures/skybox.png"

    // constructor for Cubes
    Skybox = function Skybox(name, size) {
        this.name = name;
        this.size = size;
        this.texture = null;
    }
    Skybox.prototype.init = function(drawingState) {
        this.texture = createGLTexture(drawingState.gl, image, false);
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
        }
        if (!buffers) {

            var tris = [];

            var size = this.size;

            var ltr = new Vertex(-size,  size,  size, .75, .25);
            var ltrt= new Vertex(-size,  size,  size, 0, 0);
            var ltf = new Vertex(-size,  size, -size, 0, .25);
            var ltfl= new Vertex(-size,  size, -size, 1, .25);
            var lbr = new Vertex(-size, -size,  size, .75, .75);
            var lbrb= new Vertex(-size, -size,  size, 0, 1);
            var lbf = new Vertex(-size, -size, -size, 0, .75);
            var lbfl= new Vertex(-size, -size, -size, 1, .75);
            var rtr = new Vertex( size,  size,  size, .5, .75);
            var rtrt= new Vertex( size,  size,  size, .25, 0);
            var rtf = new Vertex( size,  size, -size, .25, .25);
            var rbr = new Vertex( size, -size,  size, .5, .25);
            var rbrb= new Vertex( size, -size,  size, .25, .1);
            var rbf = new Vertex( size, -size, -size, .25, .75);

            //rear face
            tris.push(new Tri(ltr, rtr, lbr));
            tris.push(new Tri(lbr, rtr, rbr));

            //left face
            tris.push(new Tri(ltr, lbfl, ltfl));
            tris.push(new Tri(ltr, lbr, lbfl));


            //bottom face
            tris.push(new Tri(lbrb, rbrb, lbf));
            tris.push(new Tri(rbr, rbf, lbf));

            //front face
            tris.push(new Tri(ltf, lbf, rbf));
            tris.push(new Tri(ltf, rbf, rtf));

            //right face
            tris.push(new Tri(rtf, rbf, rbr));
            tris.push(new Tri(rtf, rbr, rtr));

            //top face
            tris.push(new Tri(rtrt, ltrt, ltf));
            tris.push(new Tri(rtrt, ltf, rtf));

            var vertices = [];
            var tex_coords = [];
            for (var i = 0; i < tris.length; i++) {
                vertices = vertices.concat(tris[i].getVertexArray());
                tex_coords = tex_coords.concat(tris[i].getTexCoordArray());
            }

            var normals = [];


            var arrays = {
                a_pos : { numComponents: 3, data: vertices },
                a_texcoord : { numComponents: 2, data: tex_coords },
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };



    Skybox.prototype.draw = function(drawingState) {
        drawingState.gl.activeTexture(drawingState.gl.TEXTURE0);
        drawingState.gl.bindTexture(drawingState.gl.TEXTURE_2D, this.texture);
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            u_emittance_color:  drawingState.sunColor,
            u_texture:      this.texture,
            u_view:drawingState.view,
            u_proj:         drawingState.proj,
            u_suncolor:drawingState.sunColor,
            u_sunlight: drawingState.sunlight,
            u_model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    }


})();

grobjects.push(new Skybox("skybox", 5));
