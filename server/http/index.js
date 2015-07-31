var path = require('path'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    compression = require('compression');

module.exports = function(app) {

    var server = express();

    server._server = http.createServer(server);

    server.disable('x-powered-by');
    server.set('env', app.config.environment);
    // server.set('view engine', 'jade');
    // server.set('views', path.join(app.ROOT, 'app', 'views'));

    // server.engine('jade', require('jade').__express);

    // asset url helper
    // server.locals.url = require('./urls')(app);

    server.use(compression());

    if (app.config.assets.dynamic) {
        require('./dev-assets')(app, server);
    }

    // static middleware - can be multiple dirs
    app.config.assets.dirs.forEach(function(dir) {
        console.log(dir);
        server.use(express.static(path.join(app.ROOT, dir), {
            maxAge: app.config.assets.maxAge
        }));
    });

    if (app.config.logging.http) {
        server.use(morgan(app.config.logging.http));
    };

    return server;
};
