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
            if (sendErrorsToCatch && errs > 0) {
                node.error("ActionServer: " + node.name + ": Something went wrong.", msg);
            } else {
                send(msg);
            }
            done();
        });
    }
    RED.nodes.registerType("sendtext", SendTextNode);
}
