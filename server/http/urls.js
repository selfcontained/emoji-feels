var LEADING_SLASH = /^\//;

module.exports = function(app) {

    var config = app.config.assets,
        root = config.root,
        manifest = config.manifest,
        versioned = config.versioned;

    function getVersionedFilename(filename) {
        return manifest[filename] || filename;
    }

    // used w/in views for building asset urls
    return function(path) {
        if(versioned) path = getVersionedFilename(path);

        return [root, trimLeadingSlash(path)].join('');
    };

};

function trimLeadingSlash(value) {
    return value.replace(LEADING_SLASH, '');
}
