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

// Variable Stuff
var typedKey = '';
var fontPath;

var spacing = 20;
var spaceWidth = 80; // width of letter
var fontSize = 100;
var lineSpacing = fontSize * 1.5;
var textW = 0;
var letterX = 50 + spacing;
var letterY = lineSpacing;

var stepSize = 2;
var danceFactor = 1;
var spreadFactor = 1;

var font;
var pnts;
var originalPnts = [];

var freeze = false;

var colors;
var colorsIndex = 0;
var lineColor;

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
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // My setup stuff
  colors = [
    color(255, 255, 0), // Yellow
    color(0, 0, 0),    // Black
    color(255, 0, 0),  // Red
    color(0, 0, 255)  // Blue
  ];
  lineColor = color(0, 0, 0);

  opentype.load('data/FreeSansNoPunch.otf', function(err, f) {
    if (err) {
      print(err);
    } else {
      font = f;
      pnts = getPoints(typedKey);
      originalPnts = JSON.parse(JSON.stringify(pnts)); // Store original points
      loop();
    }
  });
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  if (!font) return;

  noFill();
  push();
  translate(letterX, letterY);

  danceFactor = 1;
  if (mouseIsPressed && mouseButton == LEFT) {
    danceFactor = map(mouseX, 0, width, 0, 3);
  }

  if (pnts.length > 0) {
    if (isMouseOverText()) {
      for (var i = 0; i < pnts.length; i++) {
        pnts[i].x += random(-stepSize, stepSize) * danceFactor;
        pnts[i].y += random(-stepSize, stepSize) * danceFactor;
      }
    }

    strokeWeight(0.1);
    stroke(lineColor);
    beginShape();
    for (var i = 0; i < pnts.length; i++) {
      vertex(pnts[i].x, pnts[i].y);
    }
    vertex(pnts[0].x, pnts[0].y);
    endShape();
  }
  pop();

  if (!freeze) {
    spreadFactor *= 1.01; // Slowly increase spread factor over time only if not frozen
  }
}

function getPoints() {
  if (!font) return [];
  
  let fontPath = font.getPath(typedKey, 0, 0, 200);
  let commands = fontPath.commands;
  
  let points = [];
  for (let cmd of commands) {
    if (cmd.x !== undefined && cmd.y !== undefined) {
      points.push({ x: cmd.x, y: cmd.y });
    }
  }
  
  textW = fontPath.getBoundingBox().x2 - fontPath.getBoundingBox().x1;
  
  return points;
}


function isMouseOverText() {
  for (var i = 0; i < originalPnts.length; i++) {
    var d = dist(mouseX, mouseY, originalPnts[i].x + letterX, originalPnts[i].y + letterY);
    if (d < 20) return true;
  }
  return false;
}

function keyReleased() {
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
  if (keyCode == ALT) {
    freeze = !freeze;
    if (freeze) {
      noLoop();
    } else {
      loop();
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case ENTER:
    case RETURN:
      typedKey = '';
      pnts = getPoints(typedKey);
      originalPnts = JSON.parse(JSON.stringify(pnts)); // Store original points
      letterY += lineSpacing;
      letterX = 50;
      break;
    case BACKSPACE:
    case DELETE:
      background(255);
      typedKey = '';
      pnts = getPoints(typedKey);
      originalPnts = JSON.parse(JSON.stringify(pnts)); // Store original points
      letterX = 50;
      letterY = lineSpacing;
      freeze = false;
      spreadFactor = 1; // Reset spread when clearing text
      loop();
      break;
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    if (keyCode == 32) {
      typedKey = '';
      letterX += textW + spaceWidth
      pnts = getPoints(typedKey);
    } else {
      spreadFactor = 1; // Reset spread when clearing text
      typedKey = key;
      letterX += textW + spacing
      pnts = getPoints(typedKey);
    }
    originalPnts = JSON.parse(JSON.stringify(pnts)); // Store original points
    freeze = false;
    loop();
  }
}

function mousePressed() {
  colorsIndex = (colorsIndex+1)%colors.length;
  lineColor = colors[colorsIndex];
}