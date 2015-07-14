"use strict";

(function (window, factory)
{
    if (module)
     module.exports = factory();
    else if (typeof define === 'function' && define.amd)
    	define(factory);
    else
     window.eventUtil = factory();
})(this, function()
{



	var
		slice = Array.prototype.slice;

	var 
		epic = require('epic.util'),
		jsa = require('epic.jsa');

	var
		ruler = require('./lib/ruler');

	var
		optionalSymbol = '_',
		fnSymbols = ['fn', 'callback', optionalSymbol +'fn', optionalSymbol +'callback'],
		
		cache = new Map();

	var typeHelper =
	{
		alias:
		{
			'bool': 'boolean',
			'class': 'object',
			'Class': 'object',
			'func': 'function',
			'fn': 'function',
			'int': 'Number'
		},
		checker: function(item, types)
		{

			if (!item.type) return;
			if (!types)
			{
				if (Array.isArray(item.type)) return this.checker(item, item.type);
				return this.checker(item, item.type.indexOf(',') !== -1 ? item.type.split(',') : [item.type]);
			}
			if (types.length === 0) return;

			var self = this;



			item.type = types = types.map(function(type)
			{
				return self.alias[type] || type;
			});


			item.checker = function(val)
			{
				var i = types.length, type;
				while(i--)
				{
					type = types[i];
					if (type === 'Array' && Array.isArray(val)) return true;
					if (type === typeof(val)) return true;
				}

				return false;
			}

		}
	}

	var util =
	{
		exec: function(code)
		{
			return (new Function('return '+ code +';'))();
		},
		normalize: function(item)
		{
			if (!item.hasOwnProperty('optional') && item.name && item.name[0] === optionalSymbol)
				item.optional = true;

			if (item.optional === 1)
				item.optional = true;

			if (!item.type && fnSymbols.indexOf(item.name) !== -1)
				item.type = 'function';

			typeHelper.checker(item);
		},

		mix: function(target, source)
		{
			if (source === null || source === undefined) return target;
			if (target === null || target === undefined) return source;

			var self = this;

			if (Array.isArray(target) && Array.isArray(source))
			{
				source.forEach(function(item, index)
				{
					if (!item.hasOwnProperty('index') && item.hasOwnProperty('name'))
						item.index = findIndex(target, item.name);
					
					if (item.hasOwnProperty('index'))
						return target[item.index] = self.mix(target[item.index], source[index]);

					target[index] = self.mix(target[index], source[index]);
				});

				return target;
			}

			if (typeof(target) === 'object' && typeof(source) === 'object')
			{
				Object.keys(source).forEach(function(key, index)
				{
					target[key] = self.mix(target[key], source[key]);
				});
				return target;
			}

			return source;

		}
	};



	var func =
	{
		parse: function(fn)
		{
			var result = cache.get(fn);
			if (!result)
			{
				cache.set(fn, result = jsa.parse(fn));
				this.init(result);
			}

			result.hit = result.hit || 0;
			result.hit++;

			return result;
		},

		init: function(token)
		{
			this.initParams(token.params);
			this.initDefault(token);

		},

		initDefault: function(token)
		{
			token.defaults = [];

			token.params.forEach(function(item, index)
			{
				if (!item.hasOwnProperty('value')) return;
				token.defaults[index] = item.value;
			});
		},

		initParams: function(token)
		{
			if (token.length === 0) return;

			token.forEach(function(item)
			{
				if (item.comment)
					epic.mix(item, util.exec(item.comment));

				util.normalize(item);
			})
		}
	};



	var findIndex = function(target, name)
	{
		return target.findIndex(function(item){ return item.name === name; });
	};


	var parse = function(fn  /*, opts... */)
	{
		var set = func.parse(fn);

		if (arguments.length > 1)
		{
			var opts = { params: Array.prototype.slice.call(arguments, 1)};
			func.initParams(opts.params);

			set = util.mix(epic.clone(set), opts);
			func.initDefault(set);
		}


		if (!set.rules)
			set.rules = ruler.parse(set.params);


		var ctx = this;
		return function()
		{
			var args = slice.call(arguments);
			if (args.length === set.params.length || !set.rules[args.length])
				return fn.apply(ctx, args);

			return fn.apply(this, ruler.make(set, args));
		};

	};

	parse.all = function(target)
	{
		Object.keys(target).forEach(function(key)
		{
			if (typeof(target[key]) !== 'function') return;
			target[key] = parse(target[key]);
		});
		return target;
	};

	return parse;


});

