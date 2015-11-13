
    function makeArraysFromOBJ(objname, forceFlatShade) {
        var obj = LoadedOBJFiles[objname];
        if (!obj) {
            alert("Can't find obj "+String(objname));
            return null;
        }
        // this actually rebuilds everything per triangle, so we can use the simple form of drawarrays
        // we need to loop over the groups...
        // for now, I'm only doing the first group
        var groups = Object.keys(obj.groups);
        var group = obj.groups[groups[0]];
        var nfaces = group.faces.length;
        var pos = [];
        var norm = [];
        var tex = [];
        var colors = [];

        var noNormals = (!obj.normals || !obj.normals.length);
        var noTex = (!obj.texCoords || !obj.texCoords.length);

        group.faces.forEach(function(face,faceIndex) {
            var tverts = []; // save the triangle's vertices in case we need to compute a normal
            var norms=false;
           for(var v=0; v<3; v++) { // assume we have a triangle
               var vi = face[v][0];
               var ti = face[v][1];
               var ni = face[v][2];
               var vpos = obj.vertices[vi];
               pos.push(obj.vertices[vi][0]);
               pos.push(obj.vertices[vi][1]);
               pos.push(obj.vertices[vi][2]);
               tverts.push([obj.vertices[vi][0],obj.vertices[vi][1],obj.vertices[vi][2]]);
               if (ti === null) {
                   tex.push(0.0);
                   tex.push(0,0);
               } else {
                   tex.push(obj.texCoords[ti][0]);
                   tex.push(obj.texCoords[ti][1]);
               }
               if (ni === null) {
                   norm.push(0.0);
                   norm.push(1.0);
                   norm.push(0.0);
               } else {
                   norm.push(obj.normals[ni][0]);
                   norm.push(obj.normals[ni][1]);
                   norm.push(obj.normals[ni][2]);
                   norms=true;
               }
               colors.push(1.0);
               colors.push(1.0);
               colors.push(0.7);
           }
            // now that we've done a triangle, see if we need to work backward to make a normal
            if (!norms || forceFlatShade) {
                var cnorm = twgl.v3.normalize(twgl.v3.cross(twgl.v3.subtract(tverts[1],tverts[0]),
                                                            twgl.v3.subtract(tverts[2],tverts[0])));
                for (var ni=norm.length-9; ni<norm.length; ni+=3) {
                    norm[ni] =   cnorm[0];
                    norm[ni+1] = cnorm[1];
                    norm[ni+2] = cnorm[2];
                }
            }
        });
        // find the bbox
        var xmin,xmax,ymin,ymax,zmin,zmax;
        xmin = xmax = obj.vertices[0][0];
        ymin = ymax = obj.vertices[0][1];
        zmin = zmax = obj.vertices[0][2];
        obj.vertices.forEach(function (v) {
           if (v[0]<xmin) xmin=v[0];
           if (v[0]>xmax) xmax=v[0];
           if (v[1]<ymin) ymin=v[1];
           if (v[1]>ymax) ymax=v[1];
           if (v[2]<zmin) zmin=v[2];
           if (v[2]>zmax) zmax=v[2];
        });
        var arrays = {
            vpos : { numComponents: 3, data: pos },
            vnormal : { numComponents: 3, data: norm },
            vtex : { numComponents: 2, data: tex },
            vcolor : {numComponents: 3, data: colors}
        };
        // we can't make the bbox be part of the arrays since twgl will try
        // to turn it into a buffer, so stick it elsewhere
        arrays.vpos.bbox = { xmin:xmin, xmax:xmax, ymin:ymin, ymax:ymax, zmin:zmin, zmax:zmax};

        return arrays;
    }

