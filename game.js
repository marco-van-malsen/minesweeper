// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// add random mines
function addRandomMines() {
  // create a list of all possible cells where a mine can be
  var options = [];
  for (var row = 0; row < cols; row++) {
    for (var col = 0; col < rows; col++) {
      options.push([row, col]);
    }
  }

  // 10 percent of cells will have a mine
  totalMines = floor(rows * cols * 0.1);

  // add selecting random cell, add mine and the remove cell
  for (var b = 0; b < totalMines; b++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var col = choice[0];
    var row = choice[1];
    grid[col][row].mine = true;
    options.splice(index, 1);
  }
}

// check all cells and count flagged and unmarked cells
function checkCells() {
  cellsFlagged = 0;
  cellsUnmarked = 0;
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      if (grid[col][row].flagged) cellsFlagged++;
      if (!grid[col][row].revealed) cellsUnmarked++;
    }
  }

  // player finished game and won
  if (cellsFlagged === totalMines && cellsUnmarked === totalMines) gameOver = true;
  if (cellsFlagged + cellsUnmarked === totalMines) gameOver = true;
}

// count neighbors
function countAllNeighbors() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].countMines();
    }
  }
}

// create the grid
function createGrid() {
  // determine number of columns based on canvas size
  cols = floor(width / w);
  rows = floor((height - header - separator) / w);

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
  textSize(0.75 * header);
  textStyle(BOLD);
  text("Mine Sweeper", cols * w * 0.5, header * 0.5 + 1);

  // setup character dimensions (as measured in ms-paint)
  let charWidth = 16;
  let charDist = 4;
  let scoreWidth = 3 * charWidth + 2 * charDist;

  // draw black background for score
  push();
  fill(0);
  stroke(0);
  rect(4, 4, scoreWidth + 2 * charDist, header - 8);

  // draw score in red with special font
  noStroke();
  textAlign(RIGHT, CENTER);
  textFont(scoreFont);
  textSize(header);
  textStyle(NORMAL);
  fill(65, 0, 0);
  text("000", 4 + scoreWidth + 2 * charDist, header * 0.5 - 3)
  fill(255, 0, 0);
  text(totalMines - cellsFlagged, 4 + scoreWidth + 2 * charDist, header * 0.5 - 3)
  pop();
}

// what to do when a key is pressed
function keyPressed() {
  // CTRL-key
  if (keyCode === CONTROL) {
    enableCheats = true;
  }
}

// what to do when a key is released
function keyReleased() {
  // CTRL-key
  if (keyCode === CONTROL) {
    enableCheats = false;
  }

  // disable cheats
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].cheat = false;
    }
  }
}

// what to do when the mouse is pressed
function mousePressed() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      if (grid[col][row].contains(mouseX, mouseY)) {
        // reveal cell
        if (mouseButton === LEFT) {
          // ignore click when cell is flagged
          if (grid[col][row].flagged) return;

          // reveal the cell otherwise
          grid[col][row].reveal();

          // game over after if cell had a mine
          if (grid[col][row].mine) {
            gameOver = true;
            playerWins = false;
          }

          // place a flag
        } else if (mouseButton === CENTER) {
          if (grid[col][row].revealed) {
            grid[col][row].floodFillAlt();
          } else {
            grid[col][row].toggleFlag();
          }
        }
      }
    }
  }

  // redraw the canvas
  redraw();

  // prevent default
  return false;
}

// what to do when a touch event had ended
function touchEnded() {
  mousePressed();
}

// reveal all cells
function revealAllCells() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].revealed = true;
    }
  }
}
// show all cells
function showAllCells() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      grid[col][row].show();
    }
  }
}

// show the game over text
function showGameOverText() {
  // setup character dimensions (as measured in ms-paint)
  let charWidth = 16;
  let charDist = 4;

  let gameOverText = (playerWins ? "You Win" : "You Lose");
  let textWidth = (gameOverText.length * charWidth + (gameOverText.length - 1) * charDist);

  // draw black background for gome over text
  push();
  fill(0);
  stroke(0);
  rect(width - 4 - textWidth - 2 * charDist, 4, textWidth + 2 * charDist, header - 8);

  // draw text
  fill(255, 0, 0);
  textAlign(RIGHT, CENTER);
  textFont(scoreFont);
  textSize(header);
  textStyle(NORMAL);
  text(gameOverText, width - 4 - charDist, header * 0.5 - 3);
  pop();
}