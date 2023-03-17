/* 
node-red-contrib-rasa-actionserver v1.3.0
Copyright (c) 2023 Irene Weber

MIT License (http://www.opensource.org/licenses/mit-license.php)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function (RED) {
    function SetSlotsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = (config.name == "") ? "setslots" : config.name;
        node.slots = config.slots;
        node.addcheck = config.addcheck;

        
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
                errors.push(error.toString());
            }
            return outstr;
        }

        node.on('input', function (msg, send, done) {

            var newEvents = [];
            var responses = [];
            var slotsFromPayload = [];
            var slotname;
            var slotvalue;
            var event;

            try {
                responses = msg.responses;
            } catch (err) {
                node.error(node.name + " not properly initialized. Make sure that the flow contains an Init node preceding this node.", msg);
                done();
                return;
            }

            // just generating events - no checks!
            node.slots.forEach(function (rawslot) {

                slotname = prepValue(msg, rawslot.slotname, rawslot["slotname-type"]);
                slotvalue = prepValue(msg, rawslot.slotvalue, rawslot["slotvalue-type"]);
                event = { "event": "slot", "timestamp": Date.now(), "name": slotname, "value": slotvalue };
                newEvents.splice(0, 0, event);
            });

            if (this.addcheck) {
                try {
                    // msg.payload.slots = [{slotname:"location", slotvalue: "Berlin"}];
                    slotsFromPayload = RED.util.getMessageProperty(msg, "payload.slots");
                    slotsFromPayload.forEach(function (rawslot) {
                        var event = { "event": "slot", "timestamp": Date.now(), "name": rawslot.slotname, "value": rawslot.slotvalue };
                        newEvents.splice(0, 0, event);
                        if (rawslot.slotname == undefined || rawslot.slotvalue == undefined) { throw "slot name or value undefined"}
                    });
                } catch (error) {
                    node.warn("ActionServer: " + node.name + ": payload.slots faulty or not found in msg .");
                    errors.push(error.toString());  
                }
            }

            if (errors.length == 0) {
                msg.events.push(...newEvents);
                send(msg);
            } else {
                if (sendErrorsToCatch) {
                    node.error("ActionServer: " + node.name + ": Something went wrong (" + errors.join('; ') + ")", msg);
                } else {
                    send(msg);
                }
            }
            done();
        });
    }
    RED.nodes.registerType("setslots", SetSlotsNode);
}
