"use strict";

var
  args = require('../index');

var test =
{
  a: function(item, _fn)
  {
    console.log('a:', arguments);
  },
  b: function(item, _fn)
  {
    console.log('b:', arguments);
  }
};


args.all(test);


test.a({})