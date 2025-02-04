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

let numLines = 10;
let lineSpacing;
let frequencies = [];
let balls = [];
let lineThickness = 7;
let lines = [];
let activeOscillators = [];

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

  lineSpacing = canvasContainer.width() / numLines;
  frequencies = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300];
  addBall(canvasContainer.width() / 2, canvasContainer.height() / 2);

  for (let i = 0; i < numLines; i++) {
    lines.push({ x: i * lineSpacing + lineSpacing / 2, y: canvasContainer.height() / 2, speed: random(1, 7) });
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(30);
  
  // Move and draw rectangles instead of lines
  for (let i = 0; i < numLines; i++) {
    let tile = lines[i];
    tile.y += cos(frameCount * 0.005 * tile.speed);
    fill(255);
    noStroke();
    rect(tile.x - lineThickness / 2, tile.y - 25, lineThickness, 75);
  }
  
  // Move and draw balls
  for (let ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Ball-wall collisions
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvasContainer.width()) {
      ball.vx *= -1;
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasContainer.height()) {
      ball.vy *= -1;
    }
    
    // Ball-line collisions
    for (let i = 0; i < numLines; i++) {
      let tile = lines[i];
      if (ball.x > tile.x - lineThickness / 2 && ball.x < tile.x + lineThickness / 2 &&
          ball.y < tile.y + 50 && ball.y > tile.y - 50) {
        playSound(frequencies[i]);
        ball.bounces += 1;
        ball.vx *= -1;
        ball.x += ball.vx * 2;
      }
    }
    
    // Draw ball
    fill(255, 0, 0);
    noStroke();
    ellipse(ball.x, ball.y, ball.radius * 2);
  }
  
  for(let i = 0; i < balls.length; i++)
  {
    if(balls[i].bounces > 3)
    {
      balls.splice(i, 1);
    }
  }
}

// Play sound without overwriting previous ones
function playSound(frequency) {
  let osc = new p5.Oscillator();
  let env = new p5.Envelope();
  let reverb = new p5.Reverb();

  osc.setType('sine');
  osc.freq(frequency);
  osc.amp(0);
  osc.start();
  
  // Envelope settings
  env.setADSR(0.01, 0.2, 0.3, 0.5);
  env.setRange(0.5, 0);
  
  // Apply envelope
  env.play(osc);
  
  // Apply reverb
  reverb.process(osc, 3, 2);

  // Store active oscillator
  activeOscillators.push({ osc, env });

  // Stop and remove oscillator after decay time
  setTimeout(() => {
    osc.stop();
    activeOscillators = activeOscillators.filter(o => o.osc !== osc);
  }, 1000); // Remove oscillator after 1 second
}

function addBall(x, y) {
  balls.push({
    x: x,
    y: y,
    vx: random(-3, 3),
    vy: random(-3, 3),
    radius: 10,
    bounces: 0
  });
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
    userStartAudio();
    addBall(mouseX, mouseY);
}