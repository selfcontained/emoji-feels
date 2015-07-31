var assert = require('chai').assert,
    leveler = require('../index');

describe('Winston No Levels Logger', function() {

    it('should work with one logger that is enabled', function() {
        var config = leveler({
            info: true
        });

        assert.isObject(config.levels);
        assert.isString(config.level);

        assert.equal(config.level, 'info');
        assert.deepEqual(config.levels, { info: 0 });
    });

    it('should work with two loggers, one that is disabled', function() {
        var config = leveler({
            warn: true,
            info: false,
            error: true
        });

        config2 = leveler({
            info: true,
            debug: false,
            warn: true,
            error: false,
            brad: true,
            gecko: false
        });
        console.log(config2);
        assert.isObject(config.levels);
        assert.isString(config.level);
        assert.equal(config.level, 'warn');
        assert.deepEqual(config.levels, { info: 0, warn: 1, error: 2});
    });

    it('should work with three loggers, all enabled', function() {
        var config = leveler({
            warn: true,
            info: true,
            error: true,
            api: true,
            cache: true
        });

        assert.isObject(config.levels);
        assert.isString(config.level);
        assert.equal(config.level, 'warn');
        assert.deepEqual(config.levels, { warn: 0, info: 1, error: 2, api: 3, cache: 4});
    });

});
