var emojis = require('emoji-lexicon'),
    shuffle = require('lodash.shuffle');

var randomEmojis = module.exports = function(count) {
    return shuffle(emojis).slice(0, count);
};

randomEmojis.all = function() {
    return emojis;
};
