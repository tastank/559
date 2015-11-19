# Framework code for the CS559 Train Assignment

This repository contains a framwork and example code for the CS559 train assignments.

It provides two main pieces of functionality:

1. A user interface for manipulating a set of points in 2D. This is useful for making control points for curves.
2. A Timeline slider that can automatically advance itself. This is useful for making the train go.

The key files are:

* `dotWindow.js` - has the dotWindow class - the main thing you'll use
* `trainTime.js` - has the train time controller class - use it to make the slider

And then there's a bunch of Demos:

* dotWindowTest (`dotwindowTest.html` and `dotWindowTest.js`) - simplest thing to show of dotWindow. Start here for understanding
* dotWindowTestGL - shows how dotWindow can be use with webGL
* bezierDemo - a simple example using dotWindowTest to show off the DeCastlejau algorithm
* bsplineDemo - a simple example using dotWindowTest to show off bspline subdivision
* trainCurveTest - the main part of my simple test solution for P11 - note, we will not give you the actual curve computaton parts.

Looking at these examples should give you plenty of ideas as to how to use dotWindow and trainTime to make a train project.

Remember: you can't run trainCurveTest (since I didn't give you the implementation of trainCurve).