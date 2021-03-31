module.exports = function(RED) {
    
function SendButtonsNode(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    node.name = (config.name == "") ? "sendbuttons" : config.name;
    node.position = config.position;
    node.positionType = config.positionType;
    node.text = config.text;
    node.textType = config.textType;
    node.buttons = config.buttons;
    node.addmode = config.addmode;
    
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
        var responses = msg.responses;
        if (responses == undefined) {
            node.error("Not properly initialized. Make sure that the flow contains an Init node preceding this node.", msg)
        } else {    
            var allbuttons = [];
            var guibuttons = [];
            var buttonsFromPayload = [];
            
            node.buttons.forEach(function(rawbutton) {
                var bt = {
                    title:prepValue(msg,rawbutton.title, rawbutton["title-type"]),                 
                    payload:prepValue(msg,rawbutton.payload, rawbutton["payload-type"])
                };
                guibuttons.push(bt);
            });

            if (this.addmode == "no" || this.addmode == "none") {
            allbuttons = allbuttons.concat(guibuttons);
            } else {
                buttonsFromPayload = RED.util.getMessageProperty(msg,"payload.buttons"); 
            }

            if (this.addmode == "before") { allbuttons = buttonsFromPayload.concat(guibuttons);}
            if (this.addmode == "after")  { allbuttons = guibuttons.concat(buttonsFromPayload);}  

            //var responses = [{"text":text,"buttons":bttns,"elements":[],"custom":{},"template":null,"image":null,"attachment":null}]     

            // var oldresponses =  RED.util.getMessageProperty(msg,"responses");
            // var oldresponse = RED.util.getMessageProperty(msg,"responses[0]");

            var pos = Number(node.position);
            var newtext;
            if (node.text != "") {
                newtext = prepValue(msg, node.text,  node.textType); 
            };
            
            padResponses(responses, pos);
            
            var oldresponse = responses[pos];

            var oldbuttons =  responses[pos].buttons;
            var newbuttons = oldbuttons.concat(allbuttons);
        
            var updatedresponse = {
                "text":     (node.text != "") ? newtext: oldresponse.text,
                "buttons":  newbuttons,
                "elements": oldresponse.elements,
                "custom":   oldresponse.custom,
                "template": oldresponse.template,
                "image":    oldresponse.image,
                "attachment":oldresponse.attachment
            };

            responses.splice(pos,1,updatedresponse);
            msg.responses = responses;
            node.send(msg);
        }
    });
    }

    RED.nodes.registerType("sendbuttons",SendButtonsNode);
 }
