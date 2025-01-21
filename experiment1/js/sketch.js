// sketch.js - purpose and description here
// Author: Your Name
// Date:

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
let speedX = 3; // Speed of horizontal movement
let speedY = 1.5; // Speed of vertical movement

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }
    myMethod() {
        // code to run when method is called
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

  simulatedMouseX = width / 2;
  simulatedMouseY = height / 2;

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(255);

  // Update simulated mouse positions
  simulatedMouseX += speedX;
  simulatedMouseY += speedY;

  // Reverse direction when hitting canvas edges
  if (simulatedMouseX > width*1.25 || simulatedMouseX < 0) speedX *= -1;
  if (simulatedMouseY > height*1.25 || simulatedMouseY < 0) speedY *= -1;

  let circleResolution = int(map(simulatedMouseY, 0, height, 2, 80));
  let radius = simulatedMouseX - width / 2;
  let angle = TAU / circleResolution;

  strokeWeight(simulatedMouseY / 20);

  for (let i = 0; i <= circleResolution; i++) {
      // Randomize colors for each line
      let r = random(255);
      let g = random(255);
      let b = random(255);
      stroke(r, g, b);

      let x = cos(angle * i) * radius;
      let y = sin(angle * i) * radius;
      line(centerHorz, centerVert, centerHorz + x, centerVert + y);
  }
}