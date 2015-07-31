var path = require('path'),
    Crampon = require('crampon');

module.exports = function(app) {
    var environment = process.env.NODE_ENV || 'development',
        crampon = new Crampon(['production', 'development'])
            .addFile(path.join(__dirname,'config.js'))
            .addOverrideFile(path.join(app.ROOT, 'secrets.js'), true)
            .addOverride({ environment: environment });

    return crampon.getConfig(environment);
};
