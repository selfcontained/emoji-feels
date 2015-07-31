var fps = require('fps');

module.exports = function(app) {

    var ticker = fps({
        every: 10
    });

    setInterval(function() {
        ticker.tick()
    }, 1000 / 60)

    var element = document.querySelector('.emoji-fps');

    ticker.on('data', function(framerate) {
        element.innerHTML = 'FPS: ' + String(framerate)
    });
}
