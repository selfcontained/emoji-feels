log-leveler
================

If you're not particularly fond of log levels and would rather just toggle different loggers on and off, but utilize a logger library that requires levels, this library may be helpful.

## Install

```
npm install log-leveler
```

## Useage

Given a set of enabled/disabled loggers, log-leveler calculates your logger levels, and enabled level for you to feed into your favorite level-friendly logger.

```javascript
var leveler = require('log-leveler');

var config = leveler({
    info: true,
    debug: false,
    warn: true,
    error: false,
    brad: true,
    gecko: false
});

console.log(config.levels);
// { debug: 0, error: 1, gecko: 2, info: 3, warn: 4, brad: 5 }

console.log(config.level);
// info
```

Disabled loggers will be sorted to the lower levels, and your level will be set to the first enabled logger.


### Example of using it with [winston](https://github.com/flatiron/winston):

```javascript
var config = leveler({
    info: true,
    debug: false,
    warn: true,
    error: true
});

app.log = new (winston.Logger)({
	levels: config.levels,
	transports: [
		new (winston.transports.Console)({
			level: config.level
		})
	]
});
```
