module.exports = function(RED) {
    function FinishNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg, send, done) {
            var responses = msg.responses;
            var events = msg.events;

            var flow = this.context().flow;
            if (responses == undefined || events == undefined ||  flow.get('res') == undefined|| flow.get('req') == undefined) {
                node.error("Not properly initialized. Make sure that the flow contains an Init node preceding this node.", msg)
            } else {
                msg.payload = {};
                msg.payload.events = events;
                msg.payload.responses = responses;
            
                msg.res = flow.get('res');
                msg.req = flow.get('req');

                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("finish",FinishNode);
}

// no need cleaning up the msg object since the htt response only sends the payload