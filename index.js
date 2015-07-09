"use strict";

(function (window, factory)
{
    if (module)
     module.exports = factory();
    else if (typeof define === 'function' && define.amd)
    	define(factory);
    else
     window.eventUtil = factory();

})(this, function ()
{
	var
		args = require('./args'),
		epic = require('epic.util');


	var
		filter = {"static": ['length', 'name', 'arguments', 'caller', 'prototype'], "proto": ['constructor']};

	var child = function(target, source, excludes)
	{
		if (!source) return;
		var names = Object.getOwnPropertyNames(source);
		if (names.length === excludes.length) return;
		names = epic.array.minus(names, excludes);

		names.map(function(name)
		{
			target[name] = all(source[name]);
		});
	};

	var all = function(obj)
	{
		if (typeof(obj) === 'function')
		{
			var result = args(obj);
			child(result, obj, filter.static);
			child(result.prototype, obj.prototype, filter.proto);
			return result;
		} 

		if (Array.isArray(obj))
		{
			var result = [];
			obj.map(function(item)
			{
				result.push(all(item));
			});
			return result;
		}

		if (typeof(obj) === 'object')
		{
			var result = {};
			Object.keys(obj).map(function(key)  
			{
				result[key] = all(obj[key]);
			});
			return result;
		}
		
		return obj;
	};
	args.all = all;
	return args;
});

