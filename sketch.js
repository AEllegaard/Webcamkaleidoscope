let capture;
let pixelSize = 10; // Size of each pixel for the pixelation effect
let palette = [
  [255, 255, 255], // White
  [195, 0, 0]      // Red
];
let segments = 6; // Number of kaleidoscope segments

function setup() {
  createCanvas(1024,1024);
  capture = createCapture(VIDEO); // Access webcam
  capture.size(width / pixelSize, height / pixelSize); // Set resolution to low for pixelation
  capture.hide(); // Hide the default video element
  noStroke();
  angleMode(DEGREES); // Use degrees for rotation
}

function draw() {
  background(0);

  capture.loadPixels(); // Load webcam pixels
  translate(width / 2, height / 2); // Move origin to center of canvas

  for (let y = 0; y < capture.height; y++) {
    for (let x = 0; x < capture.width; x++) {
      let index = (x + y * capture.width) * 4;
      let r = capture.pixels[index];     // Red value
      let g = capture.pixels[index + 1]; // Green value
      let b = capture.pixels[index + 2]; // Blue value

      // Find the closest color in the palette
      let [pr, pg, pb] = findClosestPaletteColor(r, g, b);

      // Calculate the position relative to the center
      let dx = x - capture.width / 2; // Distance from center in X
      let dy = y - capture.height / 2; // Distance from center in Y

      // Draw the pixel block for each segment
      for (let i = 0; i < segments; i++) {
        push();
        rotate((360 / segments) * i); // Rotate to each segment
        fill(pr, pg, pb);
        rect(dx * pixelSize, dy * pixelSize, pixelSize, pixelSize);
        scale(1, -1); // Flip for mirror symmetry
        rect(dx * pixelSize, dy * pixelSize, pixelSize, pixelSize);
        pop();
      }
    }
  }
}

// Function to find the closest color in the palette
function findClosestPaletteColor(r, g, b) {
  let closestColor = palette[0];
  let closestDist = dist(r, g, b, ...palette[0]);

  for (let color of palette) {
    let d = dist(r, g, b, ...color);
    if (d < closestDist) {
      closestDist = d;
      closestColor = color;
    }
  }

  return closestColor;
}
