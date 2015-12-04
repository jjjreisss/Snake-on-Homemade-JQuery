var Snake = function() {
  this.direction = "N";
  this.segments = [[10, 10]];
}

Snake.directionsHash = {
  "N": [-1, 0],
  "S": [1, 0],
  "E": [0, 1],
  "W": [0, -1]
}

Snake.addCoordinates = function(coord, adder) {
  return [coord[0] + adder[0], coord[1] + adder[1]];
}

Snake.subtractCoordinates = function(coord, adder) {
  return [coord[0] - adder[0], coord[1] - adder[1]];
}

Snake.prototype.grow = function () {
  var last = this.segments[this.segments.length - 1];
  var newLink = Snake.subtractCoordinates(last, Snake.directionsHash[this.direction]);
  this.segments.push(newLink);
};


Snake.prototype.move = function () {
  var head = this.segments[0];
  var newLink = Snake.addCoordinates(head, Snake.directionsHash[this.direction]);
  this.segments.pop();
  this.segments.unshift(newLink);
};

Snake.prototype.turn = function (direction) {
  this.direction = direction;
};


var Board = function(size) {
  this.snake = new Snake();
  this.grid = [];
  this.size = size;
  this.apple = [];
  this.makeApple();
}

Board.prototype.populateGrid = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.grid.push([i, j]);
    }
  }
};

Board.prototype.makeApple = function () {
  var pos = [Math.floor(Math.random()*this.size), Math.floor(Math.random()*this.size)];
  while (this.snake.segments.indexOf(pos) !== -1) {
    pos = [Math.floor(Math.random()*this.size), Math.floor(Math.random()*this.size)];
  }
  this.apple = pos;
};

Board.prototype.isOver = function () {
  var that = this;
  var head = this.snake.segments[0];
  var verdict = false;
  this.snake.segments.slice(1).forEach(function(segment) {
    if (segment[0] === head[0] && segment[1] === head[1]) {
      verdict = true;
    }
  })

  if ([head[0], head[1]].indexOf(-1) !== -1) {
    verdict = true;
  } else if ([head[0], head[1]].indexOf(that.size) !== -1) {
    verdict = true;
  }

  return verdict;
};


Board.prototype.moveSnake = function () {
  this.snake.move();
  if (this.snake.segments[0][0] === this.apple[0] &&
      this.snake.segments[0][1] === this.apple[1]) {
    this.makeApple();
    this.snake.grow();
  }
  if (this.isOver() === true) {
    alert("you lose" + this.snake.segments);
  }
};

module.exports = Board;


// var a = document.querySelector('a[data-a=1]')
