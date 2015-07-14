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
		max = Math.max,
		epic = require('epic.util');

	var ruler =
	{

		parse: function(params)
		{
			return this.map(this.calc(params));
		},
		calc: function(params)
		{
			var result = [[]], optional;
			params.forEach(function(item)
			{
				optional = null;
				if (item.optional === true)
					optional = epic.clone(result, true);

				result.forEach(function(val)
				{
					val.push(item);
				});

				if (item.optional === true)
					result = result.concat(optional);
			});
			return result;
		},
		map: function(plan)
		{
			var result = {}, index = plan.length, count;
			while(index--)
			{
				count = plan[index].length;
				result[count] = result[count] || [];
				result[count].push(plan[index]);
			}
			return result;
		},
		is: function(rule, val)
		{
			if (rule.checker)
				return rule.checker(val) ? 1 : -1;
			return 0;
		},
		match: function(rules, args)
		{
			var self = this, matchs = [], ret;
			rules.forEach(function(rule, index)
			{
				args.forEach(function(arg, i)
				{
					ret = self.is(rule[i], arg[i]);
					if (ret === -1) return;
					matchs[index] = matchs[index] || 0;
					matchs[index] += ret;
				});
			});

			return rules[matchs.indexOf(max.apply(null, matchs))];
		},
		make: function(set, args)
		{
			var rule = this.match(set.rules[args.length], args);

			var result = [];
			rule.forEach(function(set, index)
			{
				return result[set.index] = args[index];
			});

			if (set.defaults.length === 0) return result;

			set.defaults.forEach(function(value, index)
			{
				if (result[index] !== undefined || value === undefined) return;
				result[index] = value;
			});

			return result;
		}
	};



	return ruler;

});

