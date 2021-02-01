
module.exports = function(RED) {
    function SetSlotsNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.name = (config.name == "") ? "setslots" : config.name;
        node.slots = config.slots;
        node.addcheck = config.addcheck;
        
        function prepValue(msg, instr, type) {
            // Extract the required value from msg
            var outstr = instr;
            if (type == "msg") {     // else  type is "str"
                outstr = RED.util.getMessageProperty(msg,instr);    
            } 
            if (outstr == undefined) {   node.error("Action server error (" + node.name + "): " + instr +  " not found in msg.payload ",  msg);} 
            return outstr;
        }
    
        node.on('input', function(msg, send, done) {    
     
            var slotsFromPayload = [];

            // just generating events - no checks!
            node.slots.forEach(function(rawslot) {
              
                var slotname = prepValue(msg,rawslot.slotname, rawslot["slotname-type"]);               
                var slotvalue = prepValue(msg,rawslot.slotvalue, rawslot["slotvalue-type"]);
                var event = {"event":"slot","timestamp":Date.now(),"name":slotname,"value":slotvalue};
                msg.events.splice(0,0,event);
            });
    
            if (this.addcheck) {
                // msg.payload.slots = [{slotname:"location", slotvalue: "Berlin"}];
                slotsFromPayload = RED.util.getMessageProperty(msg,"payload.slots");
                slotsFromPayload.forEach(function(rawslot) {
                    var event = {"event":"slot","timestamp":Date.now(),"name":rawslot.slotname ,"value":rawslot.slotvalue};
                    msg.events.splice(0,0,event);
                });   
            } 
      
            node.send(msg);
            });
        }
        RED.nodes.registerType("setslots",SetSlotsNode);
    }
    