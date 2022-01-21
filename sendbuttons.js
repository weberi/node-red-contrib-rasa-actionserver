module.exports = function (RED) {

    function SendButtonsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = (config.name == "") ? "sendbuttons" : config.name;
        node.position = config.position;
        node.positionType = config.positionType;
        node.text = config.text;
        node.textType = config.textType;
        node.buttons = config.buttons;
        node.addmode = config.addmode;

        var sendErrorsToCatch = config.senderr;  // if set, node sends error to catch and stops 
        // if not set, node issues warnings and continues     
        var errs = 0;

        function prepValue(msg, instr, type) {
            // Extract the required value from msg
            var outstr = instr;

            try {
                if (type == "msg") {     // else  type is "str"
                    outstr = RED.util.getMessageProperty(msg, instr);
                    if (outstr == undefined) { throw instr + " has no result" }
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
            var responses = msg.responses;
            if (responses == undefined) {
                node.error("Not properly initialized. Make sure that the flow contains an Init node preceding this node.", msg)
            } else {

                var newtext = "";
                if (node.text != "") {
                    newtext = prepValue(msg, node.text, node.textType);
                };

                var allbuttons = [];
                var guibuttons = [];
                var buttonsFromPayload_in = [];
                var buttonsFromPayload_checked = [];

                if (this.addmode == "before" || this.addmode == "after") {
                    try {
                        buttonsFromPayload_in = RED.util.getMessageProperty(msg, "payload.buttons");
                        if (buttonsFromPayload_in == undefined) { throw "undefined" }

                        buttonsFromPayload_in.forEach(function (rawbutton) {
                            var bt = {
                                title: prepValue(msg, rawbutton.title, rawbutton["title-type"]),
                                payload: prepValue(msg, rawbutton.payload, rawbutton["payload-type"])
                            };
                            buttonsFromPayload_checked.push(bt);
                        });
                    } catch (error) {
                        node.warn("ActionServer: " + node.name + ": payload.buttons faulty or not found in msg.");

                        errs = errs + 1;
                    }
                }

                // buttons from gui: check if buttons ok
                try {
                    node.buttons.forEach(function (rawbutton) {
                        var bt = {
                            title: prepValue(msg, rawbutton.title, rawbutton["title-type"]),
                            payload: prepValue(msg, rawbutton.payload, rawbutton["payload-type"])
                        };
                        guibuttons.push(bt);
                    });
                } catch (error) {
                    node.warn("ActionServer: " + node.name + "buttons in node config faulty or not found in msg .");
                    errs = errs + 1;
                }

                if (errs == 0) {
                    if (this.addmode == "before") {
                        allbuttons = buttonsFromPayload_checked.concat(guibuttons);
                    } else {
                        allbuttons = guibuttons.concat(buttonsFromPayload_checked);
                    };

                    var pos = Number(node.position);
                    padResponses(responses, pos);

                    var oldresponse = responses[pos];
                    var oldbuttons = responses[pos].buttons;
                    var newbuttons = oldbuttons.concat(allbuttons);

                    var updatedresponse = {
                        "text": (node.text != "") ? newtext : oldresponse.text,
                        "buttons": newbuttons,
                        "elements": oldresponse.elements,
                        "custom": oldresponse.custom,
                        "template": oldresponse.template,
                        "image": oldresponse.image,
                        "attachment": oldresponse.attachment
                    };
                    responses.splice(pos, 1, updatedresponse);
                    msg.responses = responses;
                    send(msg);
                } else {
                    if (sendErrorsToCatch) {
                        node.error("ActionServer: " + node.name + ": Something went wrong (" + errs + ")", msg);
                    } else {
                        send(msg);
                    }
                }
                done();


            }
        });
    }

    RED.nodes.registerType("sendbuttons", SendButtonsNode);
}
