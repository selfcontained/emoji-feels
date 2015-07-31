var React = require('react');

module.exports = function(app) {
    var Emoji = require('./emoji')();

    return React.createClass({
        getInitialState: function() {
            return {
                emojis: []
            };
        },
        componentDidMount: function() {
            var self = this;
            app.on('emoji', function(emoji) {
                self.state.emojis.push(emoji);

                // Remove emoji after it's animation is complete
                setTimeout(function() {
                    self.setState({
                        emojis: self.state.emojis.filter(function(emj) {
                            return emj.id !== emoji.id;
                        })
                    });
                }, 6000);

                self.setState({
                    emojis: self.state.emojis
                });
            });
        },
        componentWillUnmount: function() {
            app.off('data')
        },
        render: function() {
            var emojis = this.state.emojis;
            if(!emojis.length) {
                return (
                    <div className="emojis">
                        <h4>Waiting for emojis...</h4>
                    </div>
                );
            }

            return (
                <div className="emojis">
                    { emojis.map(function(emoji) {
                        return (
                            <Emoji value={emoji.value} size={emoji.occurrences} key={emoji.id} />
                        );
                    })}
                </div>
            );
        }
    });
};
