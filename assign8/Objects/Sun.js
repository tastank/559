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
var Sun = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    var image = new Image();
    image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woeAhcDSsQ9FQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY/z//z8DAwMTAwMDAwMDACQGAwG9HuO6AAAAAElFTkSuQmCC";

    // constructor for Cubes
    Sun = function Sun(name, position, size, resolution) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.resolution = resolution;
        this.texture = null;
    }
    Sun.prototype.init = function(drawingState) {
        this.texture = createGLTexture(drawingState.gl, image, true);
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["world-vs", "world-fs"]);
        }
        if (!buffers) {
            var vertices = [];
            var sun_color = drawingState.sunColor;
            var sun_radius = 0.4;
            var tris = [];
            //this will be a very crude sphere with high res around the poles
            //and low at the equator, but I'm OK with that.
            for (var i = 0; i < this.resolution; i++) {
                for (var j = 0; j < this.resolution; j++) {

                    var scale = Math.sqrt(1 - Math.pow(2*i / this.resolution  - 1, 2));
                    var next_scale = Math.sqrt(1 - Math.pow(2*(i+1)/this.resolution - 1, 2));

                    var theta = j*2*Math.PI/this.resolution;
                    var next_theta = (j+1)*2*Math.PI/this.resolution;

                    var y = i / this.resolution * 2 * sun_radius - sun_radius;
                    var next_y = (i+1) / this.resolution * 2 * sun_radius - sun_radius;


                    var p1 = new Vertex (
                        Math.cos(theta) * scale * sun_radius,
                        y,
                        Math.sin(theta) * scale * sun_radius,
                        0,
                        0
                        );

                    var p2 = new Vertex (
                        Math.cos(next_theta) * scale * sun_radius,
                        y,
                        Math.sin(next_theta) * scale * sun_radius,
                        1,
                        0
                        );

                    var p3 = new Vertex (
                        Math.cos(next_theta) * next_scale * sun_radius,
                        next_y,
                        Math.sin(next_theta) * next_scale * sun_radius,
                        1,
                        1
                        );

                    var p4 = new Vertex (
                        Math.cos(theta) * next_scale * sun_radius,
                        next_y,
                        Math.sin(theta) * next_scale * sun_radius,
                        0,
                        1
                        );

                    tris.push(new Tri(p1, p2, p3, sun_color));
                    tris.push(new Tri(p1, p3, p4, sun_color));
                }
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
            }


            var arrays = {
                a_pos : { numComponents: 3, data: vertices },
                a_normal : { numComponents:3, data: normals },
                a_texcoord : {numComponents:2, data: tex_coords }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Sun.prototype.draw = function(drawingState) {
        drawingState.gl.activeTexture(drawingState.gl.TEXTURE0);
        drawingState.gl.bindTexture(drawingState.gl.TEXTURE_2D, this.texture);
        // we make a model matrix to place the cube in the world
        var sun_alt = 10;
        this.position = [Math.cos(drawingState.sunAngle)*sun_alt, Math.sin(drawingState.sunAngle)*sun_alt, 0];
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        //if it were easy to determine the camera's orientation, I'd make the sun a circle and rotate it to face the camera here
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            u_specularness: 0.0,
            u_shininess:    0.0,
            u_emittance:    1.0,
            u_emittance_color:  drawingState.sunColor,
            u_texture:      this.texture,
            u_view:drawingState.view,
            u_proj:drawingState.proj,
            u_lightdir:drawingState.sunDirection,
            u_suncolor:drawingState.sunColor,
            u_sunlight: drawingState.sunlight,
            u_model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Sun.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Sun("sun", [0,0, 0],1, 40) );




