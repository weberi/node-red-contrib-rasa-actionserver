/* 
node-red-contrib-rasa-actionserver v1.3.0
Copyright (c) 2023 Irene Weber

MIT License (http://www.opensource.org/licenses/mit-license.php)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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