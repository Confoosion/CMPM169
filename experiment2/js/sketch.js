// sketch.js - purpose and description here
// Author: Jake Sales
// Date: 1/20/25

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let simulatedMouseX;
let simulatedMouseY;
let speedX = 2; // Speed of horizontal movement
let speedY = 1.5; // Speed of vertical movement

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
        background(255);
        translate(width / 2, height / 2);

        // Update simulated mouse positions
        simulatedMouseX += speedX;
        simulatedMouseY += speedY;

        // Reverse direction when hitting canvas edges
        if (simulatedMouseX > width || simulatedMouseX < 0) speedX *= -1;
        if (simulatedMouseY > height || simulatedMouseY < 0) speedY *= -1;

        var circleResolution = int(map(simulatedMouseY, 0, height, 2, 80));
        var radius = simulatedMouseX - width / 2;
        var angle = TAU / circleResolution;

        strokeWeight(simulatedMouseY / 20);

        for (var i = 0; i <= circleResolution; i++) {
          // Randomize colors for each line
          let r = random(255);
          let g = random(255);
          let b = random(255);
          stroke(r, g, b);

          var x = cos(angle * i) * radius;
          var y = sin(angle * i) * radius;
          line(0, 0, x, y);
        }
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(220);    
  // call a method on the instance
  myInstance.myMethod();

  // Set up rotation for the rectangle
  push(); // Save the current drawing context
  translate(centerHorz, centerVert); // Move the origin to the rectangle's center
  rotate(frameCount / 100.0); // Rotate by frameCount to animate the rotation
  fill(234, 31, 81);
  noStroke();
  rect(-125, -125, 250, 250); // Draw the rectangle centered on the new origin
  pop(); // Restore the original drawing context

  // The text is not affected by the translate and rotate
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", centerHorz - 105, centerVert + 40);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}