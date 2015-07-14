"use strict";

var args = require('../index');

var test = function(
	_obj	// {type:'object'}
	,id	// {type:'string'}
	,_fn
)
{
	console.log(arguments);
};

args(test)('id');
