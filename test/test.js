var
	epic = require('epic.util'),
	args = require('../index');


		var test = function
		(
			_receivers,	// type:['array', 'string'], val:1
			protocol,		// type:'string'
			data,				// type:'object'
			_fn,
			_save				// type:'bool'
		)
	{
		console.log(arguments);
	};

console.log([].findIndex);


var index = 0;
(function()
{
	var result = args(test, {name:'_receivers', val: 2});
	result('m.say.b', {data:1}, true);


}());

return;
	var test2 = function(_receivers /* type:['array', 'string'] */, protocol /* type:'string' */, data /* type:'class' */, _fn /* type:'function' */, _save /* type:'bool' */)
	{
		console.log(arguments);
	};

var testObj = 
{
	test: function(
		_receivers,
		protocol,
		data, _fn, _save
		)
	{
		console.log('root', arguments);
	},

	child:
	{
		test: function(_group, data, _fn)
	{
		console.log('child', arguments);
	}
	}

};


(function()
{
	var result = args(test);
	result('string', {data:1}, epic.noop);
}());



(function()
{
	var result = args('_group', 'data', '_fn', test);
	result({data:1});
});


(function()
{
	var result = args.all(testObj);
	result.test({data:1}, epic.noop);
	result.child.test({data:1}, epic.noop);
});



