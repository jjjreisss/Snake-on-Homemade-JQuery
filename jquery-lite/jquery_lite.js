(function() {

  var Jl = window.Jl = {};
  Jl.functionQueue = [];


  document.addEventListener('DOMContentLoaded', function() {
    for (var i = 0; i < Jl.functionQueue.length; i++) {
      Jl.functionQueue[i]();
    }
  })



  Jl.DOMNodeCollection = function(array) {
    this.array = array;
  }

  Jl.$l = function(arg) {
    if (typeof arg === "function") {
      Jl.functionQueue.push(arg);
    }

    if (typeof arg === "object" && arg instanceof HTMLElement) {
      return new Jl.DOMNodeCollection([arg]);
    }

    if (typeof arg === "string") {
      if (arg.match(/<.*>/)) {
        var tag = arg.slice(1, arg.length-1);
        return new Jl.DOMNodeCollection([document.createElement(tag)]);
      } else {
        var elementList = document.querySelectorAll(arg);
        var elementArray = [].slice.call(elementList);
        return new Jl.DOMNodeCollection(elementArray);
      }
    }

  }

  Jl.DOMNodeCollection.prototype.html = function(string) {
    if (typeof string === "string") {
      this.array.forEach(function(node) {
        node.innerHTML = string;
      })
    } else {
      return this.array[0].innerHTML;
    }
  };

  Jl.DOMNodeCollection.prototype.empty = function () {
    this.array.forEach(function(node) {
      node.innerHTML = "";
    })
  };

  Jl.DOMNodeCollection.prototype.append = function (arg) {
    if (arg instanceof Jl.DOMNodeCollection === false) {
      arg = Jl.$l(arg);
    }

    this.array.forEach(function(parent) {
      arg.array.forEach(function(child) {
        var clone = child.cloneNode(true);
        parent.appendChild(clone);
      })
    })
  };

  Jl.DOMNodeCollection.prototype.attr = function (name, value) {
    if (typeof value === "undefined") {
      return this.array[0].getAttribute(name);
    } else {
      this.array.forEach(function(node) {
        node.setAttribute(name, value);
      });
    }
  };

  Jl.DOMNodeCollection.prototype.addClass = function (name) {
    this.array.forEach(function(node) {
      node.classList.add(name);
    });
  };

  Jl.DOMNodeCollection.prototype.removeClass = function (name) {
    if (typeof name === "undefined") {
      this.array.forEach(function(node) {
        node.className = "";
      });
    }
    this.array.forEach(function(node) {
      node.classList.remove(name);
    });
  };

  Jl.DOMNodeCollection.prototype.children = function() {
    var children = [];
    this.array.forEach(function(node) {
      var theseChildren = node.childNodes;
      for (var i = 0; i < theseChildren.length; i++) {
        children.push(theseChildren[i]);
      }
    });
    return new Jl.DOMNodeCollection(children);
  }

  Jl.DOMNodeCollection.prototype.parents = function () {
    var parents = []
    this.array.forEach(function(node) {
      if (parents.indexOf(node) === -1) {
        parents.push(node.parentNode);
      }
    })
    return new Jl.DOMNodeCollection(parents);
  };

  Jl.DOMNodeCollection.prototype.find = function (selector) {
    var found = [];
    for (var i = 0; i < this.array.length; i++) {
      var elementList = this.array[i].querySelectorAll(selector)
      for (var j = 0; j < elementList.length; j++) {
        found.push(elementList[j]);
      }
    }
    return new Jl.DOMNodeCollection(found);
  };

  Jl.DOMNodeCollection.prototype.remove = function () {
    this.array.forEach(function(node) {
      node.parentNode.removeChild(node);
    });
  };

  Jl.DOMNodeCollection.prototype.on = function (type, callback) {
    this.array.forEach(function(node) {
      node.addEventListener(type, callback);
    });
  };

  Jl.DOMNodeCollection.prototype.off = function (type, callback) {
    this.array.forEach(function(node) {
      node.removeEventListener(type, callback);
    });
  };

  Jl.$l.extend = function() {
    var objects = [].slice.call(arguments);
    var merged = objects[0];
    objects.slice(1).forEach(function(object) {
      Object.keys(object).forEach(function(key) {
        merged[key] = object[key];
      })
    })
    return merged;
  }

  Jl.$l.ajax = function(options) {
    if (options === undefined) {
      options = {}
    }
    var defaults = {
      "success": function(data){console.log(data)},
      "error": function() {console.log("error")},
      "url": "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2de143494c0b295cca9337e1e96b00e0",
      "method": 'GET',
      "data": "",
      "contentType": 'application/x-www-form-urlencoded; charset=UTF-8'
    };

    options = Jl.$l.extend(defaults, options);

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === XMLHttpRequest.DONE ) {
        if(xmlhttp.status === 200){
          options["success"](JSON.parse(xmlhttp.responseText));
        } else {
          options["error"]();
        }
      }
    }

    xmlhttp.open(options["method"], options["url"], true);
    xmlhttp.send();
  };


})()

var weather = {
      type: 'GET',
      url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2de143494c0b295cca9337e1e96b00e0",
      error: function() {
        console.error("An error occured.");
      }
    }
