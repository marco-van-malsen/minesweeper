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
    this.bee = false; // does the cell have a bee in it?
    this.col = col; // index for column on gid
    this.flagged = false; // cell contains a flag
    this.neighborCount = 0; // number of neighboring bees
    this.revealed = false; // has the cell been revealed
    this.row = row; // index for row on grid
    this.sneak = false; // sneak a peak at the cell if it is a bee
    this.x = col * w; // upper left corner of cell; x-coordinate
    this.y = header + separator + row * w; // upper left corner of cell; y-coordinate
    this.w = w; // cell size in pixels, both height and width

    // with dependencies to other variables
    this.cX = this.x + 0.5 * w; // center of cell; x-coordinate
    this.cY = this.y + 0.5 * w; // center of cell; y-coordinate
  }

  // count number of bees in neighboring cells
  countBees() {
    // skip if cell contains a bee
    if (this.bee) {
      this.neighborCount = -1;
      return;
    }

    // count bees is neighbor cells
    var total = 0;
    for (var xOff = -1; xOff <= 1; xOff++) {
      var col = this.col + xOff;
      if (col < 0 || col >= cols) continue;

      for (var yOff = -1; yOff <= 1; yOff++) {
        var row = this.row + yOff;
        if (row < 0 || row >= rows) continue;

        var neighbor = grid[col][row];
        if (neighbor.bee) {
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

  // reveal cell
  reveal() {
    // already revealed, do nothing
    if (this.revealed) return;

    // reveal the cell
    this.revealed = true;

    // unflag the cell
    this.flagged = false;

    // un sneak-a-peak the cell
    this.sneak = false;

    // cell has no neighboring bees; floodfill
    if (this.neighborCount === 0) this.floodFill();
  }

  // show cell and content
  show() {
    // set and format text
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    // draw cell outline
    noFill();
    if (this.sneak) fill(225);
    stroke(0);
    rect(this.x, this.y, this.w, this.w);

    // show flagged cell
    if (this.flagged) {
      text("?", this.cX, this.cY);
    }

    // cell not revealed; return
    if (!this.revealed) return;

    // cell has a bee
    if (this.bee) {
      fill(127)
      ellipse(this.cX, this.cY, this.w * 0.5);

      // cell has neighbours
    } else {
      fill(200)
      rect(this.x, this.y, this.w, this.w);

      // show number of neighor bees
      if (this.neighborCount > 0) {
        fill(0);
        text(this.neighborCount, this.cX, this.cY);
      }
    }
  }

  // sneak a peak at the cell
  sneakPeak() {
    // do nothing if cell already revealed
    if (this.revealed) return;

    // change the flagged state
    this.sneak = this.bee;
  }

  // place a Flagged
  toggleFlag() {
    // do nothing if cell already revealed
    if (this.revealed) return;

    // change the flagged state
    this.flagged = !this.flagged;
  }
}