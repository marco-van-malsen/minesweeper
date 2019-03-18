// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// declare constants
const PRE_GAME = 0; // no game started yet
const GAME_ON = 1; // game in progress
const GAME_OVER = 2; // game over
const LEVELS = ["Beginner", "Intermediate", "Expert"];
var gameState = PRE_GAME;

// declare global variables
var buttons = []; // array with buttons
var cellsFlagged; // number cells the user has flagged as possible mine
var cellsFlaggedCorrectly; // number cells the user has CORRECTLY flagged as possible mine
var cellsUnmarked; // number of cells that have not been marked yet
var cols = 16; // number of columns
var controlsArea = 100; // pixels along x-axis reserver for controls
var difficulty = LEVELS[1]; // difficulty level, default ="Intermediate"
var footer = 40; // pixels along y-axis reserved for footer
var grid; // the grid
var header = 40; // pixels along y-axis reserved for header
var lastClickedCell = []; // track last clicked cell
var playerWins = true; // keep track if player won or lost
var rows = 16; // number of rows
var scoreFont; // font used for scoring / points
var separator = 10; // pixels along y-axis reserved for separtor between header and grid
var totalMines = 40; // total number of mines on the grid
var w = 30; // cell-size, height and width

function preload() {
  scoreFont = loadFont('assets/DS-DIGIB.TTF');
  cellFont = loadFont('assets/mine-sweeper.ttf');
}

function setup() {
  initGame();
  noLoop();
  draw();
}

function draw() {
  background(255);
  checkCells();
  drawHeader();
  drawControlsArea();
  drawFooter();
  if (gameState === GAME_OVER) {
    revealAllCells();
    showGameOverText();
  }
  showAllCells();
}