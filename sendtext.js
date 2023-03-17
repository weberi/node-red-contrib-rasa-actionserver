/* 
node-red-contrib-rasa-actionserver v1.3.0
Copyright (c) 2023 Irene Weber

MIT License (http://www.opensource.org/licenses/mit-license.php)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function (RED) {
    function SendTextNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        node.name = (config.name == "") ? "sendtext" : config.name;
        node.position = config.position;
        node.positionType = config.positionType;
        node.text = config.text;
        node.textType = config.textType;

        var sendErrorsToCatch = config.senderr;  // if set, node sends error to catch and stops 
        // if not set, node issues warnings and continues     
        var errors = [];

        function prepValue(msg, instr, type) {
            // Extract the required value from msg
            var outstr = instr;

            try {
                if (type == "msg") {     // else  type is "str"
                    outstr = RED.util.getMessageProperty(msg, instr);
                    if (outstr == undefined) {throw instr +" has no result"}
                };
            } catch (error) {
                node.warn("ActionServer: " + node.name + ": " + instr + " not found in msg.");
                errors.push(error.toString()); // 
            }
            return outstr;
        }

        function padResponses(resps, p) {
            while (resps.length <= p) {
                var resp = {
                    "text": "",
                    "buttons": [],
                    "elements": [],
                    "custom": null,
                    "template": null,
                    "image": null,
                    "attachment": null,
                };
                resps.splice(resps.length, 0, resp);
            }
            return;
        }

        node.on('input', function (msg, send, done) {
            var responses = [];
            var pos;
            var newtext;

            try {
                responses = msg.responses;
            } catch (err) {
                node.error(node.name + " not properly initialized. Make sure that the flow contains an Init node preceding this node.", msg);
                done();
                return;
            }

            pos = Number(node.position);
            if (node.text != "") {
                newtext = prepValue(msg, node.text, node.textType);
            };

            if (!(sendErrorsToCatch && errs > 0)) {
                padResponses(responses, pos);

                var oldresponse = responses[pos];
                var updatedresponse = {
                    "text": (node.text != "") ? newtext : oldresponse.text,
                    "buttons": oldresponse.buttons,
                    "elements": oldresponse.elements,
                    "custom": oldresponse.custom,
                    "template": oldresponse.template,
                    "image": oldresponse.image,
                    "attachment": oldresponse.attachment,
                };
                responses.splice(pos, 1, updatedresponse);
                msg.responses = responses;
            }
            if (sendErrorsToCatch && errors.length > 0) {
				node.error("ActionServer: " + node.name + ": Something went wrong (" +  errors.join('; ') + ")", msg);
            } else {
                send(msg);
            }
            done();
        });
    }
    RED.nodes.registerType("sendtext", SendTextNode);
}
