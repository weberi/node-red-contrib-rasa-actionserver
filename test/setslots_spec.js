var should = require("should");

var chai = require('chai'),
  expect = chai.expect;

chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two

var helper = require("node-red-node-test-helper");
helper.init(require.resolve('node-red'));

const requiredNodes = [
  require("../init.js"),
  require("../sendtext.js"),
  require("../sendextra.js"),
  require("../sendbuttons.js"),
  require("../setslots.js"),
  require("../finish.js"),
  require("../node_modules/@node-red/nodes/core/common/21-debug.js"),
  require("../node_modules/@node-red/nodes/core/common/25-catch.js"),
  require("../node_modules/@node-red/nodes/core/function/10-switch.js"),
  require("../node_modules/@node-red/nodes/core/function/15-change.js"),
  require("../node_modules/@node-red/nodes/core/function/80-template.js"),
  require("../node_modules/@node-red/nodes/core/network/21-httprequest.js"),
  require("../node_modules/@node-red/nodes/core/network/21-httpin.js")
];

describe('setslots', function () {
  var msg_small =
  {
    "action": "action_weather",
    "slots": {
      "location": "funchal",
      "session_started_metadata": null
    },
    "events": [],
    "payload": {},
    "responses": [
      {
        "text": null,
        "buttons": [],
        "elements": [],
        "custom": {},
        "template": null,
        "image": null,
        "attachment": null
      }
    ],
    "_msgid": "aece6cc3f850d507"
  };

  var flow = [
    {
      "id": "a0ec99336ec6ea39",
      "type": "tab",
      "label": "Rasaas Test Flow",
      "disabled": false,
      "info": ""
    },
    {
      "id": "setslots",
      "type": "setslots",
      "z": "a0ec99336ec6ea39",
      "name": "setslots",
      "text": "",
      "addcheck": false,  // test_
      "slots": [],
      "senderr": false,
      "x": 480,
      "y": 260,
      "wires": [
        [
          "helper"
        ]
      ]
    },
    {
      "id": "helper",
      "type": "helper",
      "z": "a0ec99336ec6ea39",
      "name": "helper",
      "field": "payload",
      "fieldType": "msg",
      "format": "handlebars",
      "syntax": "mustache",
      "template": "This is the payload: {{payload}} !",
      "output": "str",
      "x": 720,
      "y": 280,
      "wires": []
    }
  ];

  before(function (done) {
    helper.startServer(done);
  });

  after(function (done) {
    helper.stopServer(done);
  });

  afterEach(function () {
    helper.unload();
  });

  var gui_slots_ok_msg = [
    {
      "slotname": "location",
      "slotname-type": "str",
      "slotvalue": "payload.mylocationvalue",
      "slotvalue-type": "msg"
    },
    {
      "slotname": "payload.mysportsslot",     // "likes_sports",
      "slotname-type": "msg",
      "slotvalue": "payload.mysportsvalue",
      "slotvalue-type": "msg"
    }
  ];

  var gui_slots_ok_text = [
    {
      "slotname": "location",
      "slotname-type": "str",
      "slotvalue": "San Diego",
      "slotvalue-type": "str"
    }
  ];

  it('should be loaded', function (done) {
    helper.load(requiredNodes, flow, function () {
      var setslots_n = helper.getNode("setslots");
      setslots_n.should.have.property('name', 'setslots');
      done();
    });
  });


  it('should add a slot event as text from GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var setslots_n = helper.getNode("setslots");

      setslots_n.slots = gui_slots_ok_text;
      var helpern = helper.getNode("helper");
      setslots_n.receive({ ...msg_small });

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("events");
          msg.events.should.have.length(1);
          expect(msg.events).to.be.an('array').that.contains.something.like({ name: 'location', value: 'San Diego' });
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should add two slot events as msg from GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var msg_in = { ...msg_small };
      msg_in.payload = { "mylocationvalue": "Rome", "mysportsslot": "likes_sports", "mysportsvalue": true };

      var setslots_n = helper.getNode("setslots");
      setslots_n.slots = gui_slots_ok_msg;
      var helpern = helper.getNode("helper");

      setslots_n.receive(msg_in);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("events");
          msg.events.should.have.length(3);
          expect(msg.events).to.be.an('array').that.contains.something.like({ name: 'location', value: 'Rome' });
          expect(msg.events).to.contain.something.like({ name: 'likes_sports', value: true });
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should add two slot events  from payload', function (done) {
    helper.load(requiredNodes, flow, function () {

      var msg_in = { ...msg_small }
      msg_in.payload.slots = [
        {
          "slotname": "mood",
          "slotvalue": "happy"
        },
        {
          "slotname": "likes_music",
          "slotvalue": true
        }
      ];

      var setslots_n = helper.getNode("setslots");
      setslots_n.addcheck = true;
      var helper_n = helper.getNode("helper");

      setslots_n.receive(msg_in);

      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("events");
          msg.events.should.have.length(5);

          expect(msg.events).to.be.an('array').that.contains.something.like({ name: 'mood', value: 'happy' });
          expect(msg.events).to.contain.something.like({ name: 'likes_music', value: true });
          expect(msg.events).to.be.an('array').that.contains.something.like({ name: 'location', value: 'Rome' });
          expect(msg.events).to.contain.something.like({ name: 'likes_sports', value: true });
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
