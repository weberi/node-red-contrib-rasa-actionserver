/* 
node-red-contrib-rasa-actionserver v1.3.0
Copyright (c) 2023 Irene Weber

MIT License (http://www.opensource.org/licenses/mit-license.php)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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