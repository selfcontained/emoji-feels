var EventEmitter = require('events').EventEmitter;
var React = require('react');


var app = new EventEmitter();

app.primus = new window.Primus();

// Sets up emoji queue
require('./components/emoji-queue')(app);
require('./components/fps')(app);

var Emojis = require('./components/emojis')(app);

// Render initial state
React.render(
    <Emojis />,
    document.getElementById('emojis-app')
)
