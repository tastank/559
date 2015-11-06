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
var Tree = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;
    var image = new Image();
    image.src = "textures/tree.png"
    var bump_image = new Image();
    bump_image.src = "textures/tree_bump.png"

    // constructor for Cubes
    Tree = function Tree(name, position, size, resolution) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.resolution = resolution;
        this.texture = null;
        this.bump_texture = null;
    }
    Tree.prototype.init = function(drawingState) {
        this.texture = createGLTexture(drawingState.gl, image, true);
        this.bump_texture = createGLTexture(drawingState.gl, bump_image, true);
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["bump-vs", "bump-fs"]);
        }
        if (!buffers) {
            var vertices = [];
            var trunk_radius = 0.2;
            var trunk_height = 0.2
            var trunk_color = [0.2, 0.2, 0.0];
            var leaves_radius = 0.4;
            var leaves_color = [0.0, 0.5, 0.0];
            var tree_height = 1.0;
            var tris = [];
            for (var i = 0; i < this.resolution; i++) {
                var theta = 2*Math.PI/this.resolution*i;
                var next_theta = 2*Math.PI/this.resolution*(i+1);

                var bottom_center = new Vertex(0,0,0);
                var bottom_this_it = new Vertex(
                    Math.cos(theta) * trunk_radius,
                    0,
                    Math.sin(theta) * trunk_radius,
                    //Not sure I want to use parseInt
                    theta/Math.PI/2.0,
                    0
                );

                var bottom_next_it = new Vertex(
                    Math.cos(next_theta) * trunk_radius,
                    0,
                    Math.sin(next_theta) * trunk_radius,
                    next_theta/Math.PI/2.0,
                    0
                );

                var top_trunk_this_it = new Vertex(
                    Math.cos(theta) * trunk_radius,
                    trunk_height,
                    Math.sin(theta) * trunk_radius,
                    theta/Math.PI/2.0,
                    0.33334
                );

                var top_trunk_next_it = new Vertex (
                    Math.cos(next_theta) * trunk_radius,
                    trunk_height,
                    Math.sin(next_theta) * trunk_radius,
                    next_theta/Math.PI/2.0,
                    0.33334
                );

                var bottom_leaves_this_it = new Vertex (
                    Math.cos(theta) * leaves_radius,
                    trunk_height,
                    Math.sin(theta) * leaves_radius,
                    theta/Math.PI/2.0,
                    0.33333
                );

                var bottom_leaves_next_it = new Vertex (
                    Math.cos(next_theta) * leaves_radius,
                    trunk_height,
                    Math.sin(next_theta) * leaves_radius,
                    next_theta/Math.PI/2.0,
                    0.33333
                );

                var top_of_tree = new Vertex (
                    0,
                    tree_height,
                    0,
                    0.5,
                    1
                );

                //bottom of trunk
                tris.push(new Tri(bottom_center, bottom_this_it, bottom_next_it));

                //side of trunk - one rectangle, two tris
                tris.push(new Tri(bottom_next_it, bottom_this_it, top_trunk_this_it));
                tris.push(new Tri(top_trunk_this_it, top_trunk_next_it, bottom_next_it));

                //bottom of leaves - same story, though it's a trapezoid, not a rectangle
                tris.push(new Tri(top_trunk_next_it, top_trunk_this_it, bottom_leaves_this_it));
                tris.push(new Tri(bottom_leaves_this_it, bottom_leaves_next_it, top_trunk_next_it));

                //side of tree - only one tri per iteration!
                tris.push(new Tri(bottom_leaves_next_it, bottom_leaves_this_it, top_of_tree));
            }

            var vertices = [];
            var tex_coords = [];
            for (var i = 0; i < tris.length; i++) {
                vertices = vertices.concat(tris[i].getVertexArray());
                tex_coords = tex_coords.concat(tris[i].getTexCoordArray());
            }

            var normals = [];
            var colors = [];

            //do for each vertex, not just each tri
            for (var i = 0; i < tris.length ; i++) {
                normals = normals.concat(tris[i].getNormal());
                normals = normals.concat(tris[i].getNormal());
                normals = normals.concat(tris[i].getNormal());
//                colors = colors.concat(tris[i].getColor());
            }


            var arrays = {
                a_pos : { numComponents: 3, data: vertices },
                a_texcoord : { numComponents: 2, data: tex_coords },
                a_normal : { numComponents:3, data: normals },
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };



    Tree.prototype.draw = function(drawingState) {
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
            //it's a tree
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
    Tree.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
for (var i = -20; i <= 20; i+= 2) {
    for (var j = -20; j <= 20; j+= 2 ){
        if (Math.abs(i) > 11 || Math.abs(j) > 11) {
            grobjects.push(new Tree("tree"+i+"-"+j,[i, 0, j],2, 50) );
        }
    }
}


//stolen from ../ExampleObjects/texturedplane.js
//creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
//it's mostly going to be a try it once, flip if you need to. 
var createGLTexture = function (gl, image, flipY) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if(flipY){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}


