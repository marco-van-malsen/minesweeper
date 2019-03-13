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
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      if (col === c && row === r) continue;
      options.push([col, row]);
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
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
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
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      grid[col][row].countMines();
    }
  }
}

// create the grid
function createGrid() {
  // create the grid
  grid = new Array(cols);
  for (var col = 0; col < grid.length; col++) {
    grid[col] = new Array(rows);
  }

  // create cells
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      grid[col][row] = new Cell(col, row, w);
    }
  }
}

// draw controls area
function drawControlsArea() {
  // draw rectangle
  stroke(0);
  fill(200);
  rect(cols * w + separator, header + separator, controlsArea, rows * w);

  // draw buttons
  for (var b of buttons) b.show();
}

// draw footer with game instructions
function drawFooter() {
  // draw header
  stroke(0);
  fill(200);
  rect(0, height - footer - 1, cols * w, footer, w * 0.1);

  // write instructions
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(NORMAL);
  text("Left click: reveal", cols * w * 0.5, height - footer + 10);
  text("Middle click: place flag", cols * w * 0.5, height - footer + 30);
}

// draw header with game title and game info
function drawHeader() {
  // draw header
  stroke(0);
  fill(200);
  rect(0, 0, cols * w, header, w * 0.1);

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
    fill(85, 0, 0);
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

// change difficulty level
function initGame() {
  // setup game
  if (difficulty === "Beginner") {
    cols = 8;
    rows = 8;
    totalMines = 10;
  } else if (difficulty === "Intermediate") {
    cols = 16;
    rows = 16;
    totalMines = 40;
  } else if (difficulty === "Expert") {
    cols = 24;
    rows = 16;
    totalMines = 99;
  }

  // restart game
  createCanvas(cols * w + separator + controlsArea + 1, header + separator + rows * w + separator + footer + 1);
  createGrid();
  createControls();
  gameState = PRE_GAME;
}

// what to do when the mouse is pressed
function mousePressed() {
  // check if a cell was clicked
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      if (grid[col][row].isClicked(mouseX, mouseY)) {
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

  // check if a button was clicked
  for (var b of buttons) {
    if (b.isClicked(mouseX, mouseY)) b.changeDifficulty();
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

  // store current settings and translate
  push();
  translate(cols * w - 4 - textWidth - 2 * charDist, 4);

  // draw black background for gome over text
  fill(0);
  stroke(0);
  rect(0, 0, textWidth + 2 * charDist, header - 8);

  // draw text
  textAlign(LEFT, CENTER);
  textFont(scoreFont);
  textSize(header);
  textStyle(NORMAL);

  // translate to first character
  translate(charDist, header * 0.5 - 6);

  // draw all characters
  for (var c = 1; c <= gameOverText.length; c++) {
    // draw background text dimmed
    fill(85, 0, 0);
    text(8, 0, 0);

    // draw actual text un-dimmed
    fill(255, 0, 0);
    text(gameOverText.substring(c - 1, c), 0, 0);
    translate(charWidth + charDist, 0);
  }

  // draw text
  pop();
}