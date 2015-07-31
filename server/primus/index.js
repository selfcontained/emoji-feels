var path = require('path'),
    Primus = require('primus');

module.exports = function(app) {
    var primus = new Primus(app.http._server, {
        port: app.config.primus.port,
        transformer: 'websockets'
    });

    primus.save(path.join(app.ROOT, 'public', 'primus.js'));

    primus.on('connection', function(spark) {
        app.log.primus('websocket connection!');
    });

    primus.on('disconnection', function (spark) {
        app.log.primus('websocket disconnection!');
    });

    // Relay emojis to connected clients
    app.emojis.on('digest', function(digest) {
        primus.write({
            emojis: digest
        });
    });

    return primus;
};
