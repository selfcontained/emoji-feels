crampon
=======

Hierarchical configuration, made easy.


Basic Usage (No Hierarchy)
--------------------------
In it's most basic usage, you can add configuration objects to a crampon instance and then access that configuration:
```js
var Crampon = require('crampon'),
    crampon = new Crampon().add({
        root: '/home/apps/ftknox'
    });

var config = crampon.getConfig();
```


### Adding Data
Data can be added using the `add` and `addFile` methods. New data is merged with old data and if there are conflicts then new values will take precedence:
```js
var crampon = new Crampon().add({
        root: '/home/apps/ftknox',
        db: {
            name: 'ftknox',
            pwd: '1234'
        }
    })
    .addFile('./conf'); // could be conf.js or conf.json if extension is not specified

// conf.js: module.exports = { db: { pwd:'abcd' } };

assert.deepEqual(crampon.getConfig(), {
    root: '/home/apps/ftknox',
    db: {
        name: 'ftknox',
        pwd: 'abcd'
    }
});
```


Hierarchical Configuration
--------------------------
Hierarchical configuration can be used to setup environment specific configuration with the ability to inherit and override configuration for each environment:
```js
// Set the hierarchy when constructing an instance of crampon
var crampon = new Crampon(['prod', 'test', 'dev']).add({
    prod: {
        root: '/home/apps/ftknox',
        db: {
            name: 'ftknox',
            pwd: '1234'
        },
        debugLevel: 3
    },
    stage: {
        debugLevel: 2
    },
    dev: {
        db: {
            name: 'ftknox_dev'
        },
        debugLevel: 1
    }
});

// Get the dev configuration
var config = crampon.getConfig('dev');

assert.deepEqual(config, {
    root: '/home/apps/ftknox',
    db: {
        name: 'ftknox_dev',
        pwd: '1234'
    },
    debugLevel: 3
});
```

### Overrides
When using a hierarchical configuration, data added via `add` and `addFile` must have environment keys at the root.
In order to override environment specific configuration with configuration that applies in all cases you can use `addOverride` and `addOverrideFile`.

Continuing the above example, you could override the debugLevel in your dev environment in this way:
```js
crampon.addOverride({
    debugLevel: 1
});

// Get the configuration
var config = crampon.getConfig('dev');

// debugLevel is now 1 in all environments
assert.deepEqual(config, {
    root: '/home/apps/ftknox',
    db: {
        name: 'ftknox_dev',
        pwd: '1234'
    },
    debugLevel: 1
});
```

### Arrays
As of version 0.2, arrays in configuration are replaced, rather than merged.

```js
var crampon = new Crampon().add({
        favoriteColor: 'pink',
        otherColors: [
            'blue',
            'red'
        ]
    })
    .add({
        otherColors: [
            'green',
            'black'
        ]
    });

assert.deepEqual(crampon.getConfig(), {
    favoriteColor: 'pink',
    otherColors: [
        'green',
        'black'
    ]
});
```
