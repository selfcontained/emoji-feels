
module.exports = function(app) {

    var queue = [];
    var queueEl = document.querySelector('.emoji-queue');

    app.primus.on('data', function(data) {
        if(queue.length >= 100) return;

        queue.push.apply(queue, data.emojis);
        updateQueue();
    });

    setInterval(function() {
        var emoji = queue.shift();

        if(emoji !== undefined) {
            app.emit('emoji', emoji);
        }
        updateQueue();
    }, 250);

    function updateQueue (){
        queueEl.innerHTML = 'Emojis: ' + queue.length;
    }

};
