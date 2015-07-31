var React = require('react');

module.exports = function() {

    return React.createClass({
        // componentDidMount: function() {
        //
        // },
        // componentWillUnmount: function() {
        //
        // },
        render: function() {
            var size = (this.props.size) * 25+25;
            var style = {
                fontSize: size+'px',
                top: ((60-size)/2-5)+'px'
            };

            return (
                <div style={style} className="emoji">
                    {this.props.value}
                </div>
            );
        }
    });
};
