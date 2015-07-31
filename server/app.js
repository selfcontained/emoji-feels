var EventEmitter = require('events').EventEmitter,
    config = require('./config/'),
    log = require('./log/'),
    http = require('./http/'),
    primus = require('./primus/'),
    emojis = require('./services/emojis/');

module.exports = function(ROOT) {

    var app = new EventEmitter();

    app.ROOT = ROOT;
    app.config = config(app);
    app.log = log(app);
    app.http = http(app);
    app.emojis = emojis(app);
    app.primus = primus(app);

    app.emojis.on('digest', function(digest) {
        app.log.emojis('new emojis received: ', JSON.stringify(digest));
    });

    return app;
};
