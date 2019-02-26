// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// add random bees
function addRandomBees() {
  // create a list of all possible cells where a bee can be
  var options = [];
  for (var row = 0; row < cols; row++) {
    for (var col = 0; col < rows; col++) {
      options.push([row, col]);
    }
  }

  // 10 percent of cells will have a bee
  totalBees = rows * cols * 0.1;

  // add selecting random cell, add bee and the remove cell
  for (var b = 0; b < totalBees; b++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var col = choice[0];
    var row = choice[1];
    grid[col][row].bee = true;
    options.splice(index, 1);
  }
}

// check all cells and count flagged and unmarked cells
function checkCells() {
  cellsFlagged = 0;
  cellsUnmarked = 0;
  cellsRevealed = 0;
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      if (grid[col][row].flagged) cellsFlagged++;
      if (grid[col][row].revealed) {
        cellsRevealed++;
      } else {
        cellsUnmarked++;
      }
    }
  }
}

// count neighbors
function countAllNeighbors() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].countBees();
    }
  }
}

// create the grid
function createGrid() {
  // determine number of columns based on canvas size
  cols = floor(width / w);
  rows = floor(height / w);

  // create the grid
  grid = new Array(cols);
  for (var col = 0; col < grid.length; col++) {
    grid[col] = new Array(rows);
  }

  // create cells
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row] = new Cell(col, row, w);
    }
  }
}

// draw header with game title and game info
function drawHeader() {
  // draw header
  stroke(0);
  fill(200);
  rect(0, 0, cols * w, header);

  // draw game title
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text("Bee-Sweeper", cols * w * 0.5, header * 1 / 3);
  text(totalBees - cellsFlagged + "/" + totalBees + " bees", cols * w * 0.5, header * 2 / 3)

  // show number of flags
  textAlign(LEFT, CENTER);
  text("Flags", 10, header * 1 / 3);
  text(cellsFlagged, 10, header * 2 / 3);

  // show number of flags
  textAlign(RIGHT, CENTER);
  text("Unmarked : " + cellsUnmarked, cols * w - 10, header * 1 / 3);
  text("Revealed : " + cellsRevealed, cols * w - 10, header * 2 / 3);
}

// game over; reveal all cells
function gameOver() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].revealed = true;
    }
  }
}

// what to do when the mouse is pressed
function mouseMoved() {
  // only run if CTRL-key is pressed
  if (keyCode === CONTROL) {

    // calculate which cell was clicked
    let col = floor(mouseX / w);
    let row = floor((mouseY - separator - header) / w);

    // mouse not over a cell
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;

    // sneak a peak at the cell
    grid[col][row].sneakPeak();

    // prevent default
    return false;
  }
}

// what to do when the mouse is pressed
function mousePressed() {
  // calculate which cell was clicked
  let col = floor(mouseX / w);
  let row = floor((mouseY - separator - header) / w);

  // clicked outside the grid
  if (col < 0 || col >= cols || row < 0 || row >= rows) return;

  // reveal cell
  if (mouseButton === LEFT) {
    grid[col][row].reveal();
    if (grid[col][row].bee) gameOver();

    // place a flag
  } else if (mouseButton === CENTER) {
    grid[col][row].toggleFlag();
  }

  // prevent default
  return false;
}

// show all cells
function showAllCells() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].show();
    }
  }
}