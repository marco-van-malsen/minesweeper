// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

class Cell {
  constructor(col, row, w) {
    this.mine = false; // does the cell have a mine in it?
    this.col = col; // index for column on gid
    this.flagged = false; // cell contains a flag
    this.neighborCount = 0; // number of neighboring mines
    this.revealed = false; // has the cell been revealed
    this.row = row; // index for row on grid
    this.x = col * w; // upper left corner of cell; x-coordinate
    this.y = header + separator + row * w; // upper left corner of cell; y-coordinate
    this.w = w; // cell size in pixels, both height and width

    // with dependencies to other variables
    this.cX = this.x + 0.5 * w; // center of cell; x-coordinate
    this.cY = this.y + 0.5 * w; // center of cell; y-coordinate
  }

  // count number of mines in neighboring cells
  countMines() {
    // skip if cell contains a mine
    if (this.mine) {
      this.neighborCount = -1;
      return;
    }

    // count mines is neighbor cells
    var total = 0;
    for (var xOff = -1; xOff <= 1; xOff++) {
      var col = this.col + xOff;
      if (col < 0 || col >= cols) continue;

      for (var yOff = -1; yOff <= 1; yOff++) {
        var row = this.row + yOff;
        if (row < 0 || row >= rows) continue;

        var neighbor = grid[col][row];
        if (neighbor.mine) {
          total++;
        }
      }
    }
    this.neighborCount = total;
  }

  // fill neighbor cells
  floodFill() {
    for (var xOff = -1; xOff <= 1; xOff++) {
      var col = this.col + xOff;
      if (col < 0 || col >= cols) continue;

      for (var yOff = -1; yOff <= 1; yOff++) {
        var row = this.row + yOff;
        if (row < 0 || row >= rows) continue;
        grid[col][row].reveal();
      }
    }
  }

  // fill neighbor cells, but only when:
  // - clicked cell has been revealed, and
  // - neihborCount is equal to number of flagged neighbor cells
  floodFillAlt() {
    // count number of flags on neighbor cells
    let flagsFound = 0;
    for (var xOff = -1; xOff <= 1; xOff++) {
      var col = this.col + xOff;
      if (col < 0 || col >= cols) continue;

      for (var yOff = -1; yOff <= 1; yOff++) {
        var row = this.row + yOff;
        if (row < 0 || row >= rows) continue;
        if (grid[col][row].flagged) flagsFound++;
      }
    }

    // validate
    if (flagsFound != this.neighborCount) return;

    // flood fill neighbor cells without mines
    for (var xOff = -1; xOff <= 1; xOff++) {
      var col = this.col + xOff;
      if (col < 0 || col >= cols) continue;

      for (var yOff = -1; yOff <= 1; yOff++) {
        var row = this.row + yOff;
        if (row < 0 || row >= rows) continue;
        if (grid[col][row].flagged) continue;
        if (grid[col][row].revealed) continue;
        grid[col][row].reveal();
      }
    }
  }

  // check if the cell was clicked
  isClicked(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
  }

  // reveal cell
  reveal() {
    // already revealed, do nothing
    if (this.revealed) return;

    // reveal the cell
    this.revealed = true;

    // unflag the cell
    if (this.flagged) this.flagged = false;

    // game over after if cell had a mine
    if (this.mine) {
      gameState = GAME_OVER;
      playerWins = false;
    }

    // cell has no neighboring mines; floodfill
    if (this.neighborCount === 0) this.floodFill();
  }

  // show cell and content
  show() {
    // set and format text
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    // draw cell outline
    fill(192);
    stroke(100);
    rect(this.x, this.y, this.w, this.w);

    // show flagged cell
    if (this.flagged && !this.revealed) {
      push();
      translate(this.cX, this.cY);

      // base (black)
      fill(0);
      stroke(0);
      triangle(-0.2 * w, 0.3 * this.w, 0.2 * w, 0.3 * this.w, 0, 0.1 * this.w);

      // flag (red)
      fill(255, 0, 0);
      stroke(255, 0, 0);
      triangle(0, 0.1 * this.w, 0, -0.3 * this.w, -0.2 * this.w, -0.1 * this.w);
      pop();
    }

    // draw relief
    if (!this.revealed) {
      for (var margin = 1; margin <= 2; margin++) {
        // calculate corners
        let upperL = createVector(this.x + margin, this.y + margin);
        let upperR = createVector(this.x + this.w - margin, this.y + margin);
        let lowerL = createVector(this.x + margin, this.y + this.w - margin);
        let lowerR = createVector(this.x + this.w - margin, this.y + this.w - margin);

        // draw left and upper lines in white
        stroke(255);
        line(lowerL.x, lowerL.y, upperL.x, upperL.y);
        line(upperL.x, upperL.y, upperR.x, upperR.y);

        // draw lower and right lines in dark grey
        stroke(100);
        line(lowerL.x, lowerL.y, lowerR.x, lowerR.y);
        line(lowerR.x, lowerR.y, upperR.x, upperR.y);
      }
    }

    // cell not revealed; return
    if (!this.revealed) return;

    // store current settings and translate to cell center
    push();
    translate(this.cX, this.cY);

    // cell has a mine
    if (this.mine) {
      fill(0);
      stroke(0);
      ellipse(0, 0, this.w * 0.4);
      line(-0.3 * w, 0, 0.3 * w, 0);
      line(0, -0.3 * w, 0, 0.3 * w);
      line(-0.25 * w, -0.25 * w, 0.25 * w, 0.25 * w);
      line(-0.25 * w, 0.25 * w, 0.25 * w, -0.25 * w);
      fill(255);
      ellipse(-0.05 * w, -0.05 * w, this.w * 0.15);

      // cell has neighbours
    } else {
      // show number of neighbor mines
      if (this.neighborCount > 0) {
        switch (this.neighborCount) {
          case 1:
            fill(0, 0, 255); //blue
            stroke(0, 0, 255); //blue
            break;
          case 2:
            fill(0, 123, 0); // green
            stroke(0, 123, 0); // green
            break;
          case 3:
            fill(255, 0, 0); // red
            stroke(255, 0, 0); // red
            break;
          case 4:
            fill(0, 0, 128); // purple
            stroke(0, 0, 128); // purple
            break;
          case 5:
            fill(128, 0, 0); // maroon
            stroke(128, 0, 0); // maroon
            break;
          case 6:
            fill(64, 224, 208); // turquoise
            stroke(64, 224, 208); // turquoise
            // fill(175, 238, 238); // pale turquoise
            // stroke(175, 238, 238); // pale urquoise
            // fill(72, 209, 204); // medium turquoise
            // stroke(72, 209, 204); // medium turquoise
            // fill(0, 206, 209); // dark turquoise
            // stroke(0, 206, 209); // dark turquoise
            break;
          case 7:
            fill(0); // black
            stroke(0); // black
            break;
          case 8:
            fill(235); // gray (silver)
            stroke(235); // gray (silver)
            break;
        }

        textSize(0.6 * w);
        text(this.neighborCount, 0, 0);
      }
    }

    // restore previous settings
    pop()
  }

  // place a Flagged
  toggleFlag() {
    // do nothing if cell already revealed
    if (this.revealed) return;

    // toggle the flagged state
    this.flagged = !this.flagged;
  }
}