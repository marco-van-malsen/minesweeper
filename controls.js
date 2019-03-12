// Minesweeper
// Video: https://youtu.be/LFU5ZlrR21E

// Original
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Extended
// Marco van Malsen

class Control {
  constructor(x, y, w, h, label) {
    this.h = h;
    this.label = label;
    this.w = w;
    this.x = x;
    this.y = y;
  }

  // show the control
  show() {
    // draw rectangle
    if (difficulty === this.label) {
      fill(127, 255, 127);
    } else {
      fill(127);
    }
    stroke(0);
    rect(this.x, this.y, this.w, this.h);

    // draw text
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    // draw rectangle
    if (difficulty === this.label) {
      textStyle(BOLD);
    } else {
      textStyle(NORMAL);
    }
    text(this.label, this.x + this.w * 0.5, this.y + this.h * 0.5);
  }

  // check if control was clicked
  isClicked(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
  }

  // change difficulty level
  changeDifficulty() {
    if (difficulty === this.label && gameState === GAME_ON) return;
    difficulty = this.label;
    initGame();
  }
}

// add controls
function createControls() {
  var margin = 5
  var buttonW = controlsArea - 2 * margin;
  var buttonH = 25;
  var buttonX = cols * w + separator + margin;
  var buttonY = header + separator + margin;

  buttons = [];
  for (var level in LEVELS) {
    buttons.push(new Control(buttonX, buttonY + level * (buttonH + margin), buttonW, buttonH, LEVELS[level]));
  }
}