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

// count Neighbours
function countAllNeighbours() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].countBees();
    }
  }
}

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

// game over; reveal all cells
function gameOver() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].revealed = true;
    }
  }
}

// what to do when the mouse is pressed
function mousePressed() {
  // calculate which cell was clicked
  let col = floor(mouseX / w);
  let row = floor(mouseY / w);

  // clicked outside the grid
  if (col >= cols || row >= rows) return;

  // reveal cell
  if (mouseButton === LEFT) {
    grid[col][row].reveal();
    if (grid[col][row].bee) gameOver();

    // place a flag
  } else if (mouseButton === CENTER) {
    grid[col][row].toggleFlag();
  }

  // avoid browser issues
  return false;
}