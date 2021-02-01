module.exports = function(RED) {
    function SendTextNode(config) {
        RED.nodes.createNode(this,config);

            var node = this;
            node.name = (config.name == "") ? "sendtext" : config.name;
            node.position = config.position;
            node.positionType = config.positionType;
            node.text = config.text;
            node.textType = config.textType;
        
            function prepValue(msg, instr, type) {
                // Extract the required value from msg
                var outstr = instr;
                if (type == "msg") {     // else  type is "str"
                    outstr = RED.util.getMessageProperty(msg,instr);    
                } 
                if (outstr == undefined) {   node.error("Action server error (" + node.name + "): " + instr +  " not found in msg.payload ",  msg);} 
                return outstr;
            }

            function padResponses(resps, p) {
                while (resps.length <= p) {         
                    var resp = {
                        "text":    "",
                        "buttons":  [],
                        "elements": [],
                        "custom":   null,
                        "template": null,
                        "image":    null,
                        "attachment":null,
                    };
                    resps.splice(resps.length, 0, resp);
                }
                return;
            }
    
    
        node.on('input', function(msg, send, done) {         
            var pos = Number(node.position);
            var newtext;
            if (node.text != "") {
                newtext = prepValue(msg, node.text,  node.textType); 
            };
            
            var responses = msg.responses;
            padResponses(responses, pos);
            
            var oldresponse = responses[pos];
    
            var updatedresponse = {
                "text":      (node.text != "") ? newtext: oldresponse.text,
                "buttons":   oldresponse.buttons,
                "elements":  oldresponse.elements,
                "custom":    oldresponse.custom,
                "template":  oldresponse.template,
                "image":     oldresponse.image,
                "attachment":oldresponse.attachment,
            };
            responses.splice(pos,1,updatedresponse);
            msg.responses = responses;
            node.send(msg);
            });
        }
        RED.nodes.registerType("sendtext",SendTextNode);
     }
    