module.exports = function(RED) {
    function InitNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg, send, done) {
            if (msg.payload.tracker == undefined  || msg.payload.next_action == undefined || msg.payload.tracker.slots == undefined) {
                node.error("Not properly initialized. This node needs a Rasa action request as input, see the documentation of the node.", msg)
            } else {
                var slots = msg.payload.tracker.slots;
                var action = msg.payload.next_action;
                var flow = this.context().flow;

                flow.set('tracker', msg.payload.tracker);
                flow.set('domain', msg.payload.domain);
                flow.set('res', msg.res);
                flow.set('req', msg.req);

                msg = {};
                msg.action = action;
                msg.slots = slots;
                msg.events = [];
                msg.payload = {};
                msg.responses = [{"text":null,"buttons":[],"elements":[],"custom":{},"template":null,"image":null,"attachment":null}];
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("init",InitNode);
}