/* 
node-red-contrib-rasa-actionserver v1.3.0
Copyright (c) 2023 Irene Weber

MIT License (http://www.opensource.org/licenses/mit-license.php)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function (RED) {
    "use strict";

    function SimRasaNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        node.name = (config.name == "") ? "simrasa" : config.name;
        node.action = config.action;
        node.slots = config.slots;
        node.errtocatch = config.errtocatch;  // if set, node sends error to catch and stops 

        this.on("input", function (msg, send, done) {
            const errors = [];
            let slots = this.slots; 
            let action = this.action;
            let errtocatch = this.errtocatch;

            if (!action || action.trim() === "") {
                node.warn("SimRasa Node: Action is missing. Please configure an action in the node settings.");
                if (errtocatch) {
                    node.error("SimRasa Node: Missing action.", msg);
                    done(new Error("SimRasa Node: Missing action."));
                    return;
                }
            }


            if (msg.__user_inject_props__ && msg.__user_inject_props__.hasOwnProperty("next_action") && msg.__user_inject_props__.hasOwnProperty("slots")) {  // Array.isArray(msg.__user_inject_props__)) {
                action = msg.__user_inject_props__["next_action"];
                slots = msg.__user_inject_props__["slots"];
                errtocatch = false;
            }
            delete msg.__user_inject_props__;

            let evalslots = {}
            slots = [...slots]

            function evaluateSlot(doneEvaluating) {
                if (slots.length === 0) {
                    doneEvaluating()
                    return
                }

                const s = slots.shift()
                const sname = s.slotname;
                const snamet = s["slotname-type"];
                const svalue = s.slotvalue;
                const svaluet = s["slotvalue-type"];
                let e_sname;
                let e_svalue;

                let ok = true;
                try {
                    RED.util.evaluateNodeProperty(sname, snamet, node, msg, (err, newName) => {
                        if (err) {
                            ok = false;
                            errors.push(err.toString())
                        } else if (!newName || newName.length === 0) {
                            ok = false;
                            errors.push("Missing slotname");
                        } else {
                            e_sname = newName;
                            RED.util.evaluateNodeProperty(svalue, svaluet, node, msg, (err, newValue) => {
                                if (err) {
                                    ok = false;
                                    errors.push(err.toString())
                                } else if (svaluet === 'num' && isNaN(newValue)) {
                                    ok = false;
                                    errors.push("Faulty Number value in slot " + e_sname);
                                } else if (!newValue || newValue.length === 0) {
                                    ok = false;
                                    errors.push("No value in slot " + e_sname);
                                } else {
                                    e_svalue = newValue;
                                }
                            })
                            if (ok) { evalslots[e_sname] = e_svalue; }
                            evaluateSlot(doneEvaluating)
                        }
                    })
                } catch (err) {
                    errors.push(err.toString());
                    evaluateSlot(doneEvaluating)
                }
            }

            evaluateSlot(() => {
                if (errors.length && errtocatch) {
                    node.error("ActionServer: " + node.name + " found errors (" + errors.join('; ') + ")", msg);
                } else {
                    RED.util.setMessageProperty(msg, "payload.next_action", action, true);
                    RED.util.setMessageProperty(msg, "payload.tracker.slots", evalslots, true);
                    RED.util.setMessageProperty(msg, "res", "dummy", true);
                    RED.util.setMessageProperty(msg, "req", "dummy", true);
                    if (errors.length) { node.warn("ActionServer: " + node.name + " found errors (" + errors.join('; ') + ")") };
                    send(msg);
                }
                done();
            })
        });
    }

    RED.nodes.registerType("simrasa", SimRasaNode);

    SimRasaNode.prototype.close = function () {
        if (this.onceTimeout) {
            clearTimeout(this.onceTimeout);
        }
    };

    RED.httpAdmin.post("/inject/:id", RED.auth.needsPermission("inject.write"), function (req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                if (req.body && req.body.__user_inject_props__) {
                    node.receive(req.body);
                } else {
                    node.receive();
                }
                res.sendStatus(200);
            } catch (err) {
                res.sendStatus(500);
                node.error(RED._("simrasa.failed", { error: err.toString() }));
            }
        } else {
            res.sendStatus(404);
        }
    });
}

