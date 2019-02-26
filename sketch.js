// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// declare global variables
var cellsFlagged; // number cells the user has flagged as possible bee
var cellsUnmarked; // number of cells that have not been marked yet
var cellsRevealed; // number of cells that have been revealed
var cols = 20; // number of columns
var grid; // the grid
var rows = 20; // number of rows
var w = 20; // cell-size, height and width
var totalBees; // total number of bees on the grid
var header = 40; // pixels along y-axis reserved for header
var separator = 10; // pixels along y-axis reserved for separtor between header and grid

function setup() {
  // create canvas
  createCanvas(cols * w + 1, header + separator + rows * w + 1);

  // create grid, add bees
  createGrid();
  addRandomBees();
  countAllNeighbors();
}

function draw() {
  background(255);
  checkCells();
  drawHeader();
  showAllCells();
  if (cellsFlagged + cellsUnmarked === totalBees) gameOver();
}