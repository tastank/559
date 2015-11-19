var CurveCache = function() {
    this.control_points = null;
    this.samples = null;
}

//our sampling increment
var delta_t = 0.01;
var delta_u = delta_t;

//sets an array of samples with locations of the points
CurveCache.prototype.resample = function() {
    this.samples = [];
    for (var u = 0; u < this.control_points.length; u += delta_u) {
        this.samples.push(this.eval(u));
    }
}

//takes a parameter and gives the position of the curve at that point
CurveCache.prototype.eval = function(u) {
    var prior_point = this.control_points[parseInt(u)];
    var following_point;
    if (parseInt(u) + 1 == this.control_points.length) {
        //wrap around to the beginning
        following_point = this.control_points[0];
    } else {
        following_point = this.control_points[parseInt(u) + 1];
    }
    var t = u - parseInt(u);
    return this.interpolate(prior_point, following_point, t);
}

//provides a linear interpolation between two points given a
//0-1 distance between those points
CurveCache.prototype.interpolate = function (prior_point, following_point, t) {
    var x = prior_point[0] + (following_point[0] - prior_point[0])*t;
    var y = prior_point[1] + (following_point[1] - prior_point[1])*t;
    return [x,y];
}

//to be implemented
CurveCache.prototype.arclenToU = function(u, v) {
    return u;
}
