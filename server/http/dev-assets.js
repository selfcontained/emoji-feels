var path = require('path'),
    DevBundler = require('browserify-dev-bundler');

module.exports = function(app, http) {


    var bundler = DevBundler({
        root: path.join(app.ROOT, 'client'),
        debug: app.config.assets.debug,
        transforms: ['reactify'],
        options: {
            detectGlobals: true
        }
    });

    http.use(bundler.middleware(/^\/js\/(.+)\.js$/));

    bundler
        .on('bundle-error', function(err) {
            app.log.assets('JS Bundle Error: ', err.message);
        })
        .on('bundle-updated', function(err) {
            app.log.assets('JS Bundle Updated');
        })
};
