/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(1);
	var View = __webpack_require__(3);
	
	Jl.$l(function() {
	  var $rootElement = Jl.$l(".snake");
	  var board = new Board(25);
	  var view = new View(board, $rootElement);
	
	})


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map