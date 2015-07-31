//
// given a set of enabled/disabled loggers, determines log level
// levels will be sorted so all disabled loggers are below the enabled level
//
module.exports = function(loggers) {
    if(typeof loggers != 'object') throw new Error();

	var level = null,
		levels = {};

	// put disabled loggers at the top
	Object.keys(loggers).forEach(function(type) {
		if(loggers[type]) return;

		levels[type] = Object.keys(levels).length;
	});

	// append enabled loggers
	Object.keys(loggers).forEach(function(type) {
		if(!loggers[type]) return;

		// set level to first enabled logger
		level = level === null ? type : level;
		levels[type] = Object.keys(levels).length;
	});

    // levels will be sorted with disabled loggers at the top
    // level will be set to the first enabled logger
    return {
        level: level,
        levels: levels
    };

};
