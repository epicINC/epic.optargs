var
	args = require('../index');


var test0 = function
(
	_receivers,	// {type:['array', 'string'], val:1}
	protocol,		// {type:'string'}
	data,				// {type:'object'}
	_fn,
	_save				// {type:'bool', value:true}
)
{
console.log(arguments);
};


var test1 = function(_receivers /* { type:['array', 'string'] } */, protocol /* { type:'string' } */, data /* { type:'class' } */, _fn /* { type:'function' } */, _save /* { type:'bool' } */)
{
	console.log(arguments);
};

var test = [test0, test1];

var data = [];


test.forEach(function(func)
{
	var r = args(func);
	r('r', 'g.say', {});
});
