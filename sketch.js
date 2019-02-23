// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// declare global variables
var cols; // number of columns
var grid; // the grid
var rows; // number of rows
var w = 20; // cell-size, height and width
var totalBees; // total number of bees on the grid

function setup() {
  // create canvas
  createCanvas(401, 401);

  // fixed settings that will not change
  stroke(0);
  textAlign(CENTER, CENTER);

  // create grid
  createGrid();
  addRandomBees();
  countAllNeighbours();
}

function draw() {
  background(255);
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].show();
    }
  }

  //
  // text("Cells:" + rows * cols + "; Bees:" + totalBees + "; Revealed:" + 0 + "; Flagged:" + 0, cols * w * 0.5, rows * w * 0.5);
}