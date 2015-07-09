/// <reference path="typings/node/node.d.ts"/>
'use strict';

/// next step
/// function test(_group, data/* default: "abc" */, _fn)
/// {
/// }

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
		epic = require('epic.util');

	var
		optionalSymbol = '_',
		fnSymbol = ['fn', 'callback', optionalSymbol +'fn', optionalSymbol +'callback'],
		fnArgs = /(\w+)\s*(\/\*([\s\S]*?)\*\/)*\s*,?\s*((\/\/(.*)$)|(\/\*([\s\S]*?)\*\/))*/gm;

/*
	var normalize = function(args)
	{
		var result = [];
		for (var i = 0, item; i < args.length; i++)
		{
			item = typeof(args[i]) === 'string' ? {key: args[i]} : args[i];

			item.index = i;

			if (item.optional === undefined && item.key[0] === optionalSymbol)
				item.optional = true;

			if (fnSymbol.includes(item.key))
				item.type = 'function';

			result.push(item);
		};

		return result;
	};
*/

var funcAnalyser =
{
	typeAlias: {'bool': 'boolean', 'class': 'object', 'Class': 'object'},
	parse: function(fn, opts)
	{
		var result = funcAnalyser.analyse(funcAnalyser.cut(fn));
		if (opts && opts.length !== 0)
			return funcAnalyser.normalize(funcAnalyser.mix(result, opts));
		return funcAnalyser.normalize(result);
	},

	cut: function(code)
	{
		if (typeof(code) === 'function')
			return funcAnalyser.cut(code.toString());

		var offset = code.indexOf('(') + 1;
		return code.slice(offset, code.indexOf(')', offset));
	},
	normalizeItem: function(item)
	{
		if (!item.hasOwnProperty('type') && fnSymbol.includes(item.name))
			item.type = 'function';

		if (!item.hasOwnProperty('opt') && item.name[0] === optionalSymbol)
			item.opt = true;
	},
	normalize: function(config)
	{
		config.map(function(item)
		{
			if (!item.type) return;
			if (item.name === '_receivers')

			if (Array.isArray(item.type))
			{
				var checkerSet = new Set(), arrayChecker = false;
				item.type.map(function(type)
				{
					if (type === 'array') return arrayChecker = true;

					if (funcAnalyser.typeAlias[type]) type = funcAnalyser.typeAlias[type];
					checkerSet.add(type);
				});
				return item.typeChecker = function(val)
				{
					if (arrayChecker && Array.isArray(val)) return true;
					return checkerSet.has(typeof(val));
				};
			}

			if (funcAnalyser.typeAlias[item.type]) item.type = funcAnalyser.typeAlias[item.type];

			item.typeChecker = function(val)
			{
				return item.type === typeof(val);
			}

		});
		return config;
	},
	analyse: function(code)
	{
		var match, index = 0, opts, result = [];
 
		while((match = fnArgs.exec(code)) !== null)
		{
			opts = null;
			if (RegExp.$3)
				opts = RegExp.$3;
			else if (RegExp.$6)
				opts = RegExp.$6;
			else if (RegExp.$8)
				opts = RegExp.$8;

			if (opts)
				opts = (new Function('return {'+ opts +'};'))();
			else
				opts = {};

			opts.name = RegExp.$1;
			opts.index = index++;
			funcAnalyser.normalizeItem(opts);
			result.push(opts);
			//console.log('1:%s, 2:%s, 3:%s, 4:%s, 5:%s, 6:%s, 7:%s, 8:%s', RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6, RegExp.$7, RegExp.$8);
		}
		return result;
	},
	mix: function(config, opts)
	{
		if (opts.length === 1 && Array.isArray(opts[0]))
			return funcAnalyser.mix(config, opts[0]);

		if (!Array.isArray(opts))
		opts = Array.prototype.slice.call(opts);

		var index;
		opts.map(function(opt, index)
		{
			if (opt.name)
				index = config.findIndex(function(c)
				{
					return c.name === opt.name;
				});
			else
				index = opt.index || index;
			return config[index] = epic.mix(config[index], opt);
		})
		return config;
	}
};

var ruler =
{
	parse: function(plan, index, items)
	{
		if (index === items.length) return plan;

		var optional = [];

		if (items[index].opt)
			optional = ruler.parse(epic.array.clone(plan, true), index + 1, items);

		plan.map(function(item)
		{
			item.push(items[index]);
		});
		plan = ruler.parse(plan, index + 1, items);
		return plan.concat(optional);
	},
	isMatch: function(rule, val)
	{
		if (rule.type)
			return rule.typeChecker(val) ? 1 : -1;
		else
			return 0;
	},
	find: function(rules, args)
	{
		var matchs = [];
		rules.map(function(rule, index)
		{
			for (var i = 0, result; i < args.length; i++)
			{
				result = ruler.isMatch(rule[i], args[i]);
				if (result === -1) return;
				matchs[index] = matchs[index] || 0;
				matchs[index] += result;
			};
		});
		return rules[matchs.indexOf(Math.max.apply(null, matchs))];
	}
};

	var make = function(rules, args)
	{
		var rule = ruler.find(rules[args.length], args);
		var result = [];
		rule.map(function(set, index)
		{
			return result[set.index] = args[index];
		});
		if (rule.length === rules.length) return result;

		// fill default value
		rules[rules.length][0].map(function(set)
		{
			if (!set.hasOwnProperty('val') || result[set.index] !== undefined) return;
			result[set.index] = set.val;
		});
		return result;
	};


	//var cache = new Map();

	var args = function()
	{

		var
			fn = Array.prototype.shift.call(arguments),
			config = funcAnalyser.parse(fn, arguments);


		if (config.length === 0) return fn;


		var rules = {};
		ruler.parse([[]], 0, config).map(function(item)
		{
			rules[item.length] = rules[item.length] || [];
			rules[item.length].push(item);
		});
		rules.length = config.length;

		//console.log(require('util').inspect(rules, { showHidden: false, depth: null }));

		return function()
		{
			if (arguments.length === config.length || !rules[arguments.length])
				return fn.apply(this, arguments);
			return fn.apply(this, make(rules, arguments));
		};
	};

	return args;
});



