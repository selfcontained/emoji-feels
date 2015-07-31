var EventEmitter = require('events').EventEmitter,
    uuid = require('node-uuid'),
    debounce = require('debounce'),
    deap = require('deap'),
    Twitter = require('twitter'),
    emojis = require('./random-emojis');

// Expose an emojis service to the app
module.exports = function(app) {
    var config = app.config.twitter,
        emojiService = new EventEmitter;

    // Return an empty emojiService if we don't have it enabled
    if(!config.enabled) return emojiService;

    var client = new Twitter(config);

    // Twitter stream api only lets us track 400 items
    var randomEmojis = emojis(100),
        allEmojis = emojis.all(),
        emojiRx = new RegExp(allEmojis.join('|'), 'g');

    client.stream('statuses/filter', {track: randomEmojis.join(',')}, function(stream) {
        stream
            // Identify emojis in tweets as they stream in
            .on('data', function(tweet) {
                app.log.debug('tweet');
                // Throw away randomized data, it's too fast for meh
                // if(Math.random() >= 0.5) return;
                if(!tweet || !tweet.text) return;

                var matchedEmojis = tweet.text.match(emojiRx);

                // Emit an event if there were emojis tweeted
                if(matchedEmojis && matchedEmojis.length) {
                    // process.nextTick(function() {
                    // setImmediate(function() {
                    //     emojiService.emit('emojis', matchedEmojis, tweet);
                    // });

                    matchedEmojis.forEach(function(match) {
                        if(!digest[match]) {
                            digest[match] = 1;
                            return;
                        }

                        digest[match]++;
                    });
                    reportIt();
                }
            })
            .on('error', function(error) {
                app.log.error(error);
            });
    });

    var digest = {};

    // Rollup matches into a digest object we can throttle
    emojiService.on('emojis', function(matches, tweet) {
        app.log.debug('emojis event');
        matches.forEach(function(match) {
            if(!digest[match]) {
                digest[match] = 1;
                return;
            }

            digest[match]++;
        });

         reportIt();
    });

    var reportIt = debounce(function() {
        app.log.debug('reportIt called: ', Object.keys(digest));
    // var reportIt = function() {
        emojiService.emit('digest', Object.keys(digest).map(function(emoji) {
            return {
                id: uuid(),
                value: emoji,
                occurrences: digest[emoji]
            };
        }));
        digest = {};
    }, 500);

    return emojiService;
};
