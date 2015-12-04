var View = function(board, $el) {
  this.board = board;
  this.$el = $el;

  this.setupBoard();
  this.renderSnake();
  this.bindEvents();

  window.setInterval(this.step.bind(this), 300);
}

View.prototype.setupBoard = function () {
  for (var i = 0; i < this.board.size; i++) {
    for (var j = 0; j < this.board.size; j++) {
      var $newTile = Jl.$l('<div>');
      $newTile.attr("pos", [i, j]);
      this.$el.append($newTile);
    }
  }
};

View.prototype.renderApples = function () {
  Jl.$l('div').removeClass('apple');
  var a = document.querySelector("div[pos='" + this.board.apple + "']");
  Jl.$l(a).addClass("apple");
};

View.prototype.renderSnake = function () {
  Jl.$l('div').removeClass('snake');
  this.board.snake.segments.forEach(function(segment) {
    segment = segment.toString();
    var a = document.querySelector("div[pos='" + segment + "']");
    Jl.$l(a).addClass("snake");
  })
};

View.prototype.step = function () {
  this.board.moveSnake();
  this.renderSnake();
  this.renderApples();
};

View.prototype.bindEvents = function () {
  var that = this;

  window.addEventListener("keydown", View.checkKeyPressed.bind(this), false);
};

View.checkKeyPressed = function(event) {
  if (event.keyCode === (37) && this.board.snake.direction !== "E") {
    this.board.snake.direction = "W";
  } else if (event.keyCode === (38) && this.board.snake.direction !== "S") {
    this.board.snake.direction = "N";
  } else if (event.keyCode === (39) && this.board.snake.direction !== "W") {
    this.board.snake.direction = "E";
  } else if (event.keyCode === (40) && this.board.snake.direction !== "N") {
    this.board.snake.direction = "S";
  }
}

module.exports = View;
