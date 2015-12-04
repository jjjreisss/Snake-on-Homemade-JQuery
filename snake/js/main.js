var Board = require("./snake.js");
var View = require("./snake_view.js");

Jl.$l(function() {
  var $rootElement = Jl.$l(".snake");
  var board = new Board(25);
  var view = new View(board, $rootElement);

})
