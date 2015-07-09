"use strict";

var args = require('../index');

/*
function a()
{
	this.t0 = function()
	{

	}
}
a.prototype.t1 = function(_fn)
{

};

a.tree1 = function(_fn)
{
};

a.tree1.tree2 = function(name, _fn)
{
};


args.all(a);

console.log(a.prototype.t1.toString());
console.log(a.tree1.toString());
console.log(a.tree1.tree2.toString());
*/

class b {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  t0()
  {
  	console.log('test');
  }

  static tree1()
  {
  	console.log('n');
  }
};

b.prototype.t1 = function(_fn)
{

};

b.tree1 = function(_fn)
{
};

b.tree1.tree2 = function(name, _fn)
{
};

console.log(typeof(b));

var c = args.all(b);

var d = new c();

console.log(c.prototype.t1.toString());
console.log(c.tree1.toString());
console.log(c.tree1.tree2.toString());

console.log(c.t1.toString());