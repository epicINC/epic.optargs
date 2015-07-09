"use strict";

class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  test()
  {
  	console.log('test');
  }

  static n()
  {
  	console.log('n');
  }
}

var a = function()
{
	this.b = function()
	{
	};
	this.c = function()
	{
	};
}

console.log(Object.getOwnPropertyNames(Polygon));
console.log(Object.getOwnPropertyNames(Polygon.prototype));
console.log(Object.getOwnPropertyNames(a.prototype));
