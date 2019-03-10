// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// declare global variables
var cellsFlagged; // number cells the user has flagged as possible mine
var cellsFlaggedCorrectly; // number cells the user has CORRECTLY flagged as possible mine
var cellsUnmarked; // number of cells that have not been marked yet
var cols = 20; // number of columns
var gameOver = false; // game state, game is running or over
var grid; // the grid
var header = 40; // pixels along y-axis reserved for header
var playerWins = true; // keep track if player won or lost
var rows = 20; // number of rows
var scoreFont; // font used for scoring / points
var separator = 10; // pixels along y-axis reserved for separtor between header and grid
var totalMines; // total number of mines on the grid
var w = 30; // cell-size, height and width

function preload() {
  scoreFont = loadFont('assets/DS-DIGIB.TTF');
}

function setup() {
  // create canvas
  createCanvas(cols * w + 1, header + separator + rows * w + 1);

  // create grid, add mines
  createGrid();
  addRandomMines();
  countAllNeighbors();
  noLoop();
  draw();
}

function draw() {
  background(255);
  checkCells();
  drawHeader();
  if (gameOver) {
    revealAllCells();
    showGameOverText();
  }
  showAllCells();
}