// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

// add random mines
function addRandomMines(c, r) {
  // create a list of all possible cells where a mine can be
  // takes two variables: c(olumn) and r(ow) of cell where no bomb is to be placed
  var options = [];
  for (var row = 0; row < cols; row++) {
    for (var col = 0; col < rows; col++) {
      if (row === r && col === c) continue;
      options.push([row, col]);
    }
  }

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
  cellsFlaggedCorrectly = 0;
  cellsUnmarked = 0;
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      if (grid[col][row].flagged) cellsFlagged++;
      if (grid[col][row].flagged && grid[col][row].mine) cellsFlaggedCorrectly++;
      if (!grid[col][row].revealed) cellsUnmarked++;
    }
  }

  // player wins the game
  if (cellsFlaggedCorrectly === totalMines) gameState = GAME_OVER;
  if (cellsUnmarked === totalMines) gameState = GAME_OVER;
  if (cellsFlaggedCorrectly + cellsUnmarked === totalMines) gameState = GAME_OVER;
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

  // setup character dimensions (as measured in ms-paint)
  let charWidth = 16;
  let charDist = 4;
  let scoreWidth = 3 * charWidth + 2 * charDist;

  // store current settings
  push();

  // draw black background for score
  fill(0);
  stroke(0);
  rect(4, 4, scoreWidth + 2 * charDist, header - 8);

  // draw score in red with special font
  noStroke();
  textAlign(RIGHT, CENTER);
  textFont(scoreFont);
  textSize(header);
  textStyle(NORMAL);
  let score = totalMines - cellsFlagged;
  for (let digit = 1; digit <= 3; digit++) {
    // calculate location where to draw digits
    let charX = 4 + charDist + (charDist + charWidth) * (digit);
    let charY = header * 0.5 - 3;

    // draw zeroes in dull red as a background
    fill(100, 0, 0);
    text(8, charX, charY);

    // skip if nothing to do
    if (digit === 1 && score < 100) continue;
    if (digit === 2 && score < 10) continue;

    // draw background in dull red
    fill(255, 0, 0);
    if (score >= 100) {
      let scoreHundreds = int(score / 100);
      text(scoreHundreds, charX, charY);
      score -= scoreHundreds * 100;
    } else if (score >= 10) {
      let scoreTens = int(score / 10);
      text(scoreTens, charX, charY);
      score -= scoreTens * 10;
    } else {
      text(score, charX, charY);
    }
  }

  // restore previous settings
  pop();
}

// what to do when the mouse is pressed
function mousePressed() {
  for (var col = 0; col < cols; col++) {
    for (var row = 0; row < rows; row++) {
      if (grid[col][row].contains(mouseX, mouseY)) {
        // add random mines and count neighbors upon first click by user
        // this to avoid the first click being a bomb
        if (gameState === PRE_GAME) {
          addRandomMines(col, row);
          countAllNeighbors();
          gameState = GAME_ON;
        }

        // reveal cell
        if (mouseButton != CENTER && mouseButton != RIGHT) {
          // ignore click when cell is flagged
          if (grid[col][row].flagged) return;

          // reveal the cell otherwise
          grid[col][row].reveal();

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