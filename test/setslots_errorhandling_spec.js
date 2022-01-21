var should = require("should");

var chai = require('chai'),
  expect = chai.expect;

chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two

var helper = require("node-red-node-test-helper");
const { assert } = require("chai");
// var helper = require("../index.js");
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
  require("../node_modules/@node-red/nodes/core/network/21-httpin.js"),
];

describe('setslots errorhandling', function () {

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
}

var msg_big =
{
  "action": "action_weather",
  "slots": {
    "location": "mali",
    "session_started_metadata": null
  },
  "events": [
    {
      "event": "slot",
      "timestamp": 1642349433559,
      "name": "location",
      "value": "Spain"
    }
  ],
  "payload": {
    "request": {
      "type": "City",
      "query": "Bamako, Mali",
      "language": "en",
      "unit": "m"
    },
    "slots": [
      {
          "slotname": "mood",
          "slotvalue": "happy"
      },
      "mrks",
      {
          "slotname": "likes_music",
          "slotvalue": true
      }
  ],
    "location": {
      "name": "Bamako",
      "country": "Mali",
      "region": "Bamako",
      "lat": "12.650",
      "lon": "-8.000",
      "timezone_id": "Africa/Bamako",
      "localtime": "2022-01-16 16:10",
      "localtime_epoch": 1642349400,
      "utc_offset": "0.0"
    },
    "current": {
      "observation_time": "04:10 PM",
      "temperature": 32,
      "weather_code": 113,
      "weather_icons": [
        "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"
      ],
      "weather_descriptions": [
        "Sunny"
      ],
      "wind_speed": 19,
      "wind_degree": 100,
      "wind_dir": "E",
      "pressure": 1014,
      "precip": 0,
      "humidity": 15,
      "cloudcover": 0,
      "feelslike": 30,
      "uv_index": 9,
      "visibility": 8,
      "is_day": "yes"
    },
    "text": "It is Sunny in Bamako, Mali at the moment. The temperature is 32 degrees, the humidity is 15% and the wind speed is 19 mph."
  },
  "responses": [
    {
      "text": "It is Sunny in Bamako, Mali at the moment. The temperature is 32 degrees, the humidity is 15% and the wind speed is 19 mph.",
      "buttons": [],
      "elements": [],
      "custom": {},
      "template": null,
      "image": "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
      "attachment": null
    }
  ],
  "_msgid": "b1848de10342bbb5"
}

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
  },
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

var gui_slots_faulty = [
  {
    "slotname": "location",
    "slotname-type": "str",
    "slotvalue": "payload.something",
    "slotvalue-type": "msg"
  },
  {
    "slotname": "payload.mysportsslot",     // "likes_sports",
    "slotname-type": "msg",
    "slotvalue": "payload.mysportsvalue",
    "slotvalue-type": "msg"
  }
];

var gui_slots_correct = [
  {
    "slotname": "location",
    "slotname-type": "str",
    "slotvalue": "Pirmasens",
    "slotvalue-type": "str"
  }
];

it('should warn  if there is a problem with json paths and senderr is set to false', function (done) {
  helper.load(requiredNodes, flow, function () {
    var setslots_n = helper.getNode("setslots");
    var helper_n = helper.getNode("helper");

    setslots_n.slots = gui_slots_faulty;
    setslots_n.senderr = false;
    setslots_n.emit("input", msg_big );

    var c = 0;
    helper_n.on("input", function (msg) {
      c += 1;
    });
    setTimeout(function () {
      try {
        c.should.equal(1);
        helper.log().called.should.be.true;
        var logEvents = helper.log().args.filter(function (evt) {
          return evt[0].type == "setslots";
        });
        logEvents[0][0].should.have.property('level', helper.log().WARN);
        logEvents[0][0].should.have.a.property('msg');
        logEvents[0][0].msg.toString().should.startWith("ActionServer:");
        done();
      } catch {
        done(e);
      }
    }, 1550);
  });
});

it('should warn  if there is a problem with json paths and senderr is set to true', function (done) {
  helper.load(requiredNodes, flow, function () {
    var setslots_n = helper.getNode("setslots");
    var helper_n = helper.getNode("helper");

    setslots_n.slots = gui_slots_faulty;  
    setslots_n.senderr = true;
    setslots_n.emit("input", msg_big );

    var c = 0;
    helper_n.on("input", function (msg) {
      c += 1;
    });
    setTimeout(function () {
      try {
        c.should.equal(1);
        helper.log().called.should.be.true;
        var logEvents = helper.log().args.filter(function (evt) {
          return evt[0].type == "setslots";
        });
        logEvents[0][0].should.have.property('level', helper.log().WARN);
        logEvents[0][0].should.have.a.property('msg');
        logEvents[0][0].msg.toString().should.startWith("ActionServer:");
        done();
      } catch (error) {
        done(error);
      }
    }, 1550);
  });
});

it('should warn  if there is a problem with json paths when addcheck is set to true', function (done) {
  helper.load(requiredNodes, flow, function () {
    var setslots_n = helper.getNode("setslots");
    var helper_n = helper.getNode("helper");

    setslots_n.addcheck = true;
    setslots_n.senderr = false;
    setslots_n.emit("input", msg_big );

    var c = 0;
    helper_n.on("input", function (msg) {
      c += 1;
    });
    setTimeout(function () {
      try {
        c.should.equal(1);
        helper.log().called.should.be.true;
        var logEvents = helper.log().args.filter(function (evt) {
          return evt[0].type == "setslots";
        });
        logEvents[0][0].should.have.property('level', helper.log().WARN);
        logEvents[0][0].should.have.a.property('msg');
        logEvents[0][0].msg.toString().should.startWith("ActionServer:");
        done();
      } catch (error) {
        done(error);
      }
    }, 1550);
  });
});


it('should propagate msg if there is a problem with json paths and senderr is set to false', function (done) {

  helper.load(requiredNodes, flow, function () {
    var helper_n = helper.getNode("helper");
    var setslots_n = helper.getNode("setslots");
    setslots_n.slots = gui_slots_faulty;
    setslots_n.senderr = false;

    setslots_n.emit("input", msg_small);

    helper_n.on("input", (msg) => {
      try {
        msg.should.have.a.property("events");
        msg.events.should.have.length(0);
        msg.should.have.a.property("responses");
        expect(msg.responses).to.be.like(msg_small.responses);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

  it('should not propagate msg if there is a problem with json paths and senderr is set to true', function (done) {

    helper.load(requiredNodes, flow, function () {
      var helper_n = helper.getNode("helper");
      var setslots_n = helper.getNode("setslots");
      setslots_n.slots = gui_slots_faulty;
      setslots_n.senderr = true;

      setslots_n.emit("input", msg_small );
      setTimeout(function () {

        helper_n.on("input", (msg) => {
          try {
            done("helper node got input.");
          } catch (e) {
            done(e);
          }
        });
      }, 1900);
      done();
    });
  });
});
