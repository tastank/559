var CurveCache = function() {
    this.control_points = null;
    this.samples = null;
    this.aux_control_points = null;
    this.segment_length = null;
}

//our sampling increment
var delta_t = 0.01;
var delta_u = delta_t;

//sets an array of samples with locations of the points
CurveCache.prototype.resample = function() {
    this.samples = [];

    //create some aux points to help define the bezier curve
    //there must be two for each existing control point which are colinear
    //with the control point
    this.aux_control_points = [];
    for (var i = 0; i < this.control_points.length; i++) {
        var prev_control_point = (i == 0) ?
            this.control_points[this.control_points.length - 1] :
            this.control_points[i - 1];
        var this_control_point = this.control_points[i];
        var next_control_point = (i+1 == this.control_points.length) ?
            this.control_points[0] :
            this.control_points[i+1];
        //get a good average to oppose the slope of the line connecting the points on each side
        //slope is a misnomer if you like using it in the mathematical sense
        var incoming_slope = [this_control_point[0] - prev_control_point[0],
                              this_control_point[1] - prev_control_point[1]];
        var outgoing_slope = [this_control_point[0] - next_control_point[0],
                              this_control_point[1] - next_control_point[1]];
        incoming_slope = normalize(incoming_slope);
        outgoing_slope = normalize(outgoing_slope);
        var slope_bisector = [incoming_slope[0] + outgoing_slope[0],
                              incoming_slope[1] + outgoing_slope[1]];
        var ortho_slope = [-slope_bisector[1], slope_bisector[0]];

        //do later
        var incoming_length = dist(prev_control_point, this_control_point);
        var outgoing_length = dist(this_control_point, next_control_point);

        //first point is ortho_slope * constant
        //second is -ortho_slope * other_constant
        var width_coefficient = 0.2;
        var aux_point_0 = [
            this_control_point[0] - ortho_slope[0] * width_coefficient * incoming_length,
            this_control_point[1] - ortho_slope[1] * width_coefficient * incoming_length
        ];
        var aux_point_1 = [
            this_control_point[0] + ortho_slope[0] * width_coefficient * outgoing_length,
            this_control_point[1] + ortho_slope[1] * width_coefficient * outgoing_length
        ];

        //2i
        this.aux_control_points.push(aux_point_0);
        //2i+1
        this.aux_control_points.push(aux_point_1);

    }


    //to make following calculations a bit easier
    this.aux_control_points.push(this.aux_control_points[0]);
    this.points = this.control_points.slice(0);
    this.points.push(this.control_points[0]);


    //calculate the length of the curve segments
    //Idea: the arc length will always be slightly exceeded by the lengths of the line
    //segments tracing it out at the halfway point (or any other point for that matter),
    //and will always slightly exceed the length of a line directly from its starting
    //point to its midpoint and directly from there to its endpoint.
    //Average these two lengths and we get a pretty good idea for the length of the curve.
    //we want the length of the whole arc to equal this.control_points.length, so normalize
    //the segment lengths to add up to that when finished
    this.segment_length = [];
    var cum_seg_length = 0;
    for (var i = 0; i < this.control_points.length; i++) {
        var point0 = this.points[i];
        var point1 = this.aux_control_points[2*i+1];
        var point2 = this.aux_control_points[2*i+2];
        var point3 = this.points[i + 1];

        var t = 0.5;
        var interp01 = linear_interpolate(point0, point1, t);
        var interp12 = linear_interpolate(point1, point2, t);
        var interp23 = linear_interpolate(point2, point3, t);
        var interp012 = linear_interpolate(interp01, interp12, t);
        var interp123 = linear_interpolate(interp12, interp23, t);
        var interp0123 = linear_interpolate(interp012, interp123, t);

        var length1 = dist(point0, interp01) +
            dist(interp01, interp012) +
            dist(interp012, interp123) +
            dist(interp123, interp23) +
            dist(interp23, point3);

        var length2 = dist(point0, interp0123) + dist(interp0123, point3);

        this.segment_length.push((length1 + length2)/2);
        cum_seg_length += this.segment_length[i];
    }
    //we still need to scale the length to this.control_points.length
    var scalar = cum_seg_length / this.control_points.length;
    for (var i = 0; i < this.control_points.length; i++) {
        this.segment_length[i] /= scalar;
    }


    for (var u = 0; u < this.control_points.length; u += delta_u) {
        this.samples.push(this.eval(u));
    }
}

var normalize = function(vector) {
    var mag = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
    return [vector[0]/mag, vector[1]/mag];
}

var dist = function(point0,point1) {
    return length(point1[0] - point0[0], point1[1] - point0[1]);
}

var length = function(x,y) {
    return Math.sqrt(x*x + y*y);
}

//takes a parameter and gives the position of the curve at that point
CurveCache.prototype.eval = function(u) {
    u = u % this.control_points.length;
    var prior_point = this.control_points[parseInt(u)];
    var prior_aux_point = this.aux_control_points[2*parseInt(u)+1];
    var following_point;
    var following_aux_point;
    if (parseInt(u) + 1 == this.control_points.length) {
        //wrap around to the beginning
        following_point = this.control_points[0];
        following_aux_point = this.aux_control_points[0];
    } else {
        following_point = this.control_points[parseInt(u) + 1];
        following_aux_point = this.aux_control_points[2*parseInt(u) + 2];
    }
    var t = u - parseInt(u);
    //so now we have the length along the curve and the four points:
    //prior_point, prior_aux_point, following_aux_point, following_point

    return this.interpolate(
        prior_point,
        prior_aux_point,
        following_aux_point,
        following_point,
        t
    );
}

//returns a direction vector for the curve at point u
//Not sure how useful this will actually be
CurveCache.prototype.eval_dir = function(u) {
    u = u % this.control_points.length;
    var x_dir = this.eval(u + delta_u)[0] - this.eval(u)[0];
    var y_dir = this.eval(u + delta_u)[1] - this.eval(u)[1];
    return normalize([x_dir, y_dir]);
}

//provides a linear interpolation between two points given a
//0-1 distance between those points
CurveCache.prototype.interpolate = function (
    point0,
    point1,
    point2,
    point3,
    t
) {
    //Do the iterative linear interpolations
    var interp01 = linear_interpolate(point0, point1, t);
    var interp12 = linear_interpolate(point1, point2, t);
    var interp23 = linear_interpolate(point2, point3, t);
    var interp012 = linear_interpolate(interp01, interp12, t);
    var interp123 = linear_interpolate(interp12, interp23, t);
    var interp0123 = linear_interpolate(interp012, interp123, t);

    return interp0123;
}

var linear_interpolate = function(point0, point1, t) {
    var x = point0[0] + (point1[0] - point0[0])*t;
    var y = point0[1] + (point1[1] - point0[1])*t;
    return [x,y];
}

CurveCache.prototype.arclenToU = function(u, v) {
    u = u % this.control_points.length;

    //First calculate the length of the curve (todo: do in resample())
    //next, normalize it to the number of points (todo: also do in resample())
    //do this for all segments individually
    //u should be normalized to this value as well
    //Find the number of segments preceding u (i.e., the largest number such that the normalized length
    //of all segments up to that number is smaller than u); call this number n
    //subtract this from u for u'
    //u'/length(segment on which u will be found) + n = new_u
    var i = -1;
    var cum_seg_length = 0;

    while (cum_seg_length <= u) {
        i++;
        cum_seg_length += this.segment_length[i];
    }
    //u appears on the ith segment
    //this length is still in cum_seg_length, so remove it
    cum_seg_length -= this.segment_length[i];

    //this tells us how far u extends into segment i
    var t = u - cum_seg_length;

    //this isn't exactly t yet - we have to divide by the length of this segment
    t /= this.segment_length[i];
    //so t is now the fraction of the segment we have to travel - add that to the segment's length and we're in business!

    //because javascript will try to concatenate them, I know it
    return -(-i - t);
}

