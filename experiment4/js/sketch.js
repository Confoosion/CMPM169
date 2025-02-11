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

let particles = [];
let prevMouseX, prevMouseY;
let speedThreshold = 10;
let speedMultiplier = 0.5;
let explosionRadius = 20;

// Default particle color (white)
let currentColor;

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

  prevMouseX = mouseX;
  prevMouseY = mouseY;
  currentColor = color(255); // Set initial color to white
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(0, 50); 

  let speedX = mouseX - prevMouseX;
  let speedY = mouseY - prevMouseY;
  let mouseSpeed = dist(mouseX, mouseY, prevMouseX, prevMouseY);
  let particleSize = map(mouseSpeed, 0, speedThreshold * 2, 5, 20);

  // Create a new particle with the current color
  particles.push(new Particle(mouseX, mouseY, speedX, speedY, particleSize, currentColor));

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

// Particle class
class Particle {
  constructor(x, y, vx, vy, particleSize, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.alpha = 255;
    this.particleSize = particleSize;
    this.color = col; // Store the color
    this.exploding = false;
    this.explosionSize = particleSize * random(2, 4);
    this.growthFactor = 0.2;
    this.shrinkFactor = 0.9;
  }

  triggerExplosion() {
    this.exploding = true;
    let angle = random(TWO_PI);
    let speed = random(2, 6);
    this.vel.add(p5.Vector.fromAngle(angle).mult(speed));
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.95);

    if (this.exploding) {
      this.particleSize = lerp(this.particleSize, this.explosionSize, this.growthFactor);
    }

    let minSize = 5;
    if (this.particleSize > minSize) {
      this.particleSize *= this.shrinkFactor;
    } else {
      this.particleSize = minSize;
      this.vel.set(0, 0); // Stop movement

      // Stop fading when reaching minSize
      this.alpha = 255;
      return; // Exit update to prevent further alpha reduction
    }

    this.alpha -= 5; // Continue fading only if not at minSize
}


  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.pos.x, this.pos.y, this.particleSize, this.particleSize);
  }
}

// Change particle color when clicking
function mousePressed() {
  checkForExplosion();

  // Generate a new random color (for example, blue shades)
  currentColor = color(random(255), random(255), random(255));
}

function checkForExplosion() {
  let nearbyParticles = [];

  // Find particles near the mouse
  for (let p of particles) {
    let d = dist(p.pos.x, p.pos.y, mouseX, mouseY);
    if (d < explosionRadius) {
      nearbyParticles.push(p);
    }
  }

  // If at least 5 particles are close, trigger explosion
  if (nearbyParticles.length >= 5) {
    for (let p of nearbyParticles) {
      p.triggerExplosion();
    }
  }
}