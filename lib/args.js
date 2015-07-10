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
	var fnArgs = /(\w+)\s*(\/\*([\s\S]*?)\*\/)*\s*,?\s*((\/\/(.*)$)|(\/\*([\s\S]*?)\*\/))*/gm;

	var analyser =
	{
		parse: function(code)
		{
			if (typeof(code) === 'function')
				return this.args(code.toString());

			var body = this.cut(code);

		},
		analysis: function(body)
		{

		},
		cut: function(code)
		{
			var start = code.indexOf('function') + 8;
			start = code.indexOf('(', 8);
			end = this.boundary(code, start);
			return code.substring(start +1, end);
		},
		end: function(code, index)
		{
			while(index++)
			{
				if (code[index] === ')') return index;
				if (code[index] === '(')
					index = code.indexOf(')', index);
			}
			throw new Error('unknow args format');
		},
		analysis: function(body)
		{
			var result = [];
		}

	};

	var paramItem =
	{
		parse: function(body)
		{
			var result = this.position(body);

			var a = this.pair(body, result);
			console.log('result', a);
		},
		position: function(code)
		{
			if (!code || code.length === 0) return [];

			var index = 0, count = code.length, result = [0];

			do
			{
				if (code[index] === ',')
				{
					result.push(index +);
					continue;
				}
				if (code[index] === '/')
				{
					result.push({comment:index});
					index = code.indexOf(',', index) - 1;
					if (index === -1) break;
				}

			} while(index++ < count);

			result.push(count);

			return result;
		},
		pair: function(code, pos)
		{
			var start, result = [];

			pos.reduce(function(left, right)
			{
				if (right.comment)
				{
					right.left = left;
					return right;
				}

				if (left.comment)
					result.push({name:code.substring(left.left, left.comment), comment: code.substring(left.comment, right)});
				else
					result.push(code.substring(left, right));
				return right
			});
			return result;
		}


	}


	paramItem.parse('a,b /* value:1 */,c');
	//paramItem.parse('a');
	//paramItem.parse('');

});