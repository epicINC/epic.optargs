## epic.optargs
  
  js optional args

## Installation

```bash
$ npm install epic.optargs
```

### Config

```js
{
	name:'',	// string
	index:0,	// number
	optional:true,	// bool
	type:'',	// string & array
	value:''	// object, default value
}
```

type alias

```js
{
	'bool': 'boolean',
	'class': 'object',
	'Class': 'object',
	'func': 'function',
	'fn': 'function',
	'int': 'Number'
}
```

## Usage

```js
var args = require('epic.optargs');
```

```js
// default config
// _ : {optional: true}
// [fn, callback] : {type: 'function'}
var test = function(_obj, id, _fn){ console.log(arguments); };
args(test)('id');
```

```js
// comment config

// inline
var test = function(_obj /* {type:'object'} */, id /* {type:'string'} */, _fn){ console.log(arguments); };

// multi
var test = function(
	_obj,	// {type:'object'}
	id,	// {type:'string'}
	_fn
)
{
	console.log(arguments);
};
// or
var test = function(
	_obj	// {type:'object'}
	,id	// {type:'string'}
	,_fn
)
{
	console.log(arguments);
};
```

```js
// runtime config
var test = function(_obj, id, _fn){ console.log(arguments); };
args(test, {name:'id', value:'id'}, {index:0, value:{}});
```

## Contributors
  
  Author: [S](http://github.com/slightboy)

## License

MIT