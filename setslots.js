
module.exports = function (RED) {
    function SetSlotsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = (config.name == "") ? "setslots" : config.name;
        node.slots = config.slots;
        node.addcheck = config.addcheck;

        
        var sendErrorsToCatch = config.senderr;  // if set, node sends error to catch and stops 
        // if not set, node issues warnings and continues     
        var errs = 0;

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
                errs = errs + 1;
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
                //msg.events.splice(0, 0, event);
            });

            if (this.addcheck) {
                try {
                    // msg.payload.slots = [{slotname:"location", slotvalue: "Berlin"}];
                    slotsFromPayload = RED.util.getMessageProperty(msg, "payload.slots");
                    slotsFromPayload.forEach(function (rawslot) {
                        var event = { "event": "slot", "timestamp": Date.now(), "name": rawslot.slotname, "value": rawslot.slotvalue };
                        newEvents.splice(0, 0, event);
                        if (rawslot.slotname == undefined || rawslot.slotvalue == undefined) { throw "undefined"}
                        //msg.events.splice(0, 0, event);
                    });
                } catch (error) {
                    node.warn("ActionServer: " + node.name + ": payload.slots faulty or not found in msg .");
                    errs = errs + 1;
                }
            }

            if (  errs == 0 ) { 
                msg.events.push(...newEvents);
                send(msg);
            } else {
                if (sendErrorsToCatch) { node.error("ActionServer: " + node.name + ": Something went wrong (" + errs + ")", msg);
                } else { send(msg);
                }
            }    
            done();
        });
    }
    RED.nodes.registerType("setslots", SetSlotsNode);
}
