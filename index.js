var app = require('./server/app')(__dirname);

app.http._server.listen(app.config.port, function(err) {
    if(err) return console.log('Error starting server: ', err.toString());

    console.log('Server started: http://localhost:%s', app.config.port);
});
