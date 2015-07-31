var winston = require('winston'),
    leveler = require('log-leveler');

module.exports = function(app) {
    var log,
        config = app.config.logging,
        leveled = leveler(config.enabled);

    log = new (winston.Logger)({
        levels: leveled.levels,
        colors: config.loggers,
        transports: [
            new (winston.transports.Console)({
                level: leveled.level,
                colorize: config.colorize,
                timestamp: config.timestamp
            })
        ]
    });

    // dump sample log to log what's on
    Object.keys(config.loggers).forEach(function(logger) {
        log[logger]('logger enabled');
    });

    return log;
};
