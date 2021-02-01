module.exports = function(RED) {
    function FinishNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg, send, done) {

            var flow = this.context().flow;

            var responses = msg.responses;
            var events = msg.events;

            msg.payload = {};
            msg.payload.events = events;
            msg.payload.responses = responses;
          
            msg.res = flow.get('res');
            msg.req = flow.get('req');

            node.send(msg);
        });
    }
    RED.nodes.registerType("finish",FinishNode);
}
