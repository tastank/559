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

    // constructor for Cubes
    Tree = function Tree(name, position, size, resolution) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.resolution = resolution;
    }
    Tree.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["world-vs", "world-fs"]);
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

                var bottom_center = new Point(0,0,0);
                var bottom_this_it = new Point(
                    Math.cos(theta) * trunk_radius,
                    0,
                    Math.sin(theta) * trunk_radius
                    );

                var bottom_next_it = new Point(
                    Math.cos(next_theta) * trunk_radius,
                    0,
                    Math.sin(next_theta) * trunk_radius
                    );

                var top_trunk_this_it = new Point(
                    Math.cos(theta) * trunk_radius,
                    trunk_height,
                    Math.sin(theta) * trunk_radius
                    );

                var top_trunk_next_it = new Point (
                    Math.cos(next_theta) * trunk_radius,
                    trunk_height,
                    Math.sin(next_theta) * trunk_radius
                    );

                var bottom_leaves_this_it = new Point (
                    Math.cos(theta) * leaves_radius,
                    trunk_height,
                    Math.sin(theta) * leaves_radius
                    );

                var bottom_leaves_next_it = new Point (
                    Math.cos(next_theta) * leaves_radius,
                    trunk_height,
                    Math.sin(next_theta) * leaves_radius
                    );

                var top_of_tree = new Point (
                    0,
                    tree_height,
                    0
                    );

                //bottom of trunk
                tris.push(new Tri(bottom_center, bottom_this_it, bottom_next_it, trunk_color));

                //side of trunk - one rectangle, two tris
                tris.push(new Tri(bottom_next_it, bottom_this_it, top_trunk_this_it, trunk_color));
                tris.push(new Tri(top_trunk_this_it, top_trunk_next_it, bottom_next_it, trunk_color));

                //bottom of leaves - same story, though it's a trapezoid, not a rectangle
                tris.push(new Tri(top_trunk_next_it, top_trunk_this_it, bottom_leaves_this_it, leaves_color));
                tris.push(new Tri(bottom_leaves_this_it, bottom_leaves_next_it, top_trunk_next_it, leaves_color));

                //side of tree - only one tri per iteration!
                tris.push(new Tri(bottom_leaves_next_it, bottom_leaves_this_it, top_of_tree, leaves_color));
            }

            var vertices = [];
            for (var i = 0; i < tris.length; i++) {
                vertices = vertices.concat(tris[i].getVertexArray());
            }

            var normals = [];
            var colors = [];

            //do for each vertex, not just each tri
            for (var i = 0; i < tris.length ; i++) {
                normals = normals.concat(tris[i].getNormal());
                normals = normals.concat(tris[i].getNormal());
                normals = normals.concat(tris[i].getNormal());
                colors = colors.concat(tris[i].getColor());
                colors = colors.concat(tris[i].getColor());
                colors = colors.concat(tris[i].getColor());
            }


            var arrays = {
                a_pos : { numComponents: 3, data: vertices },
                a_normal : { numComponents:3, data: normals },
                a_color : {numComponents:3, data: colors }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Tree.prototype.draw = function(drawingState) {
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
for (var i = -4; i <= 4; i++) {
    for (var j = -4; j <= 4; j++ ){
        if (Math.abs(i) < 2 || Math.abs(j) < 2) {
            grobjects.push(new Tree("tree"+i+"-"+j,[i, 0, j],1, 200) );
        }
    }
}




