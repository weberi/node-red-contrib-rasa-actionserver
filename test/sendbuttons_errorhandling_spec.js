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
  require("../setslots.js"),
  require("../sendbuttons.js"),
  require("../finish.js"),
  require("../node_modules/@node-red/nodes/core/common/21-debug.js"),
  require("../node_modules/@node-red/nodes/core/common/25-catch.js"),
  require("../node_modules/@node-red/nodes/core/function/10-switch.js"),
  require("../node_modules/@node-red/nodes/core/function/15-change.js"),
  require("../node_modules/@node-red/nodes/core/function/80-template.js"),
  require("../node_modules/@node-red/nodes/core/network/21-httprequest.js"),
  require("../node_modules/@node-red/nodes/core/network/21-httpin.js")
];

describe('sendbuttons', function () {

  var msg_big_2 =
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
      "buttontitle1": "No, thanks",
      "buttonpayload1": "/goodbye",
      "buttons": [{ "title": "I feel good", "payload": "/tell_happy" }, { "title": "I feel sad", "payload": "/tell_sad" }],
      //"buttons": [],
      "request": {
        "type": "City",
        "query": "Bamako, Mali",
        "language": "en",
        "unit": "m"
      },
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

  var msg_big_3 =
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
      "buttontitle1": "No, thanks",
      "buttonpayload1": "/goodbye",
      "buttons": [{"title": "I feel happy", "payload": "/tell_happy" }, { "title": "I feel sad", "payload": "/tell_sad" }],    
      //"buttons": [],
      "request": {
        "type": "City",
        "query": "Bamako, Mali",
        "language": "en",
        "unit": "m"
      },
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

  var msg_big_4 =
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
      "buttontitle1": "No, thanks",
      "buttonpayload1": "/goodbye",
      "buttons": [{ "title": "I feel good", "payload": "/tell_happy" }, { "title": "I feel sad", "payload": "/tell_sad" }],
      //"buttons": [],
      "request": {
        "type": "City",
        "query": "Bamako, Mali",
        "language": "en",
        "unit": "m"
      },
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
      "id": "sendbuttons",
      "type": "sendbuttons",
      "z": "ffc07de2423bdb86",
      "name": "sendbuttons",
      "position": "1",
      "positionType": "num",
      "text": "",
      "textType": "str",
      "addmode": "no",
      "senderr": false,
      "buttons": [],
      "x": 790,
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
      "z": "ffc07de2423bdb86",
      "name": "helper",
      "active": true,
      "tosidebar": true,
      "console": false,
      "tostatus": false,
      "complete": "true",
      "targetType": "full",
      "statusVal": "",
      "statusType": "auto",
      "x": 1070,
      "y": 300,
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

  var gui_buttons_ok_text = [
    {
      "title": "No, thanks",
      "title-type": "str",
      "payload": "/goodbye",
      "payload-type": "str"
    },
    {
      "title": "I have more questions",
      "title-type": "str",
      "payload": "/hello",
      "payload-type": "str"
    },
    {
      "title": "Please tell me more",
      "title-type": "str",
      "payload": "/inform_location",
      "payload-type": "str"
    }
  ];


  var gui_buttons_faulty_msg = [
    {
      "title": "payload.dings",
      "title-type": "msg",
      "payload": "/goodbye",
      "payload-type": "str"
    },
    {
      "title": "I have more questions",
      "title-type": "str",
      "payload": "/hello",
      "payload-type": "str"
    },
    {
      "title": "Please tell me more",
      "title-type": "str",
      "payload": "/inform_location",
      "payload-type": "str"
    }
  ];

  it('should warn  if there is a problem with json paths and senderr is set to false', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");
      sendbuttons_n.position = 1;
      sendbuttons_n.buttons = gui_buttons_faulty_msg;

      sendbuttons_n.senderr = false;
      sendbuttons_n.emit("input", msg_big_2);

      var c = 0;
      helper_n.on("input", function (msg) {
        c += 1;
      });
      setTimeout(function () {
        try {
          c.should.equal(1);
          helper.log().called.should.be.true;
          var logEvents = helper.log().args.filter(function (evt) {
            return evt[0].type == "sendbuttons";
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
    // fault in payload
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");

      sendbuttons_n.position = 2;
      sendbuttons_n.buttons = gui_buttons_faulty_msg;
      sendbuttons_n.addmode = "after";
      sendbuttons_n.senderr = true;

      sendbuttons_n.emit("input", msg_big_3);

      var c = 0;
      helper_n.on("input", function (msg) {
        c += 1;
      });
      setTimeout(function () {
        try {
          c.should.equal(1);
          helper.log().called.should.be.true;
          var logEvents = helper.log().args.filter(function (evt) {
            return evt[0].type == "sendbuttons";
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
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");

      sendbuttons_n.position = 0;
      sendbuttons_n.buttons = gui_buttons_faulty_msg;
      sendbuttons_n.addmode = "after";
      sendbuttons_n.senderr = false;
      sendbuttons_n.emit("input", msg_big_4);

      helper_n.on("input", (msg) => {
        try {
          msg.should.have.a.property("responses");
          expect(msg.responses).to.be.like(msg_big_4.responses);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should not propagate msg if there is a problem with json paths and senderr is set to true', function (done) {

    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");

      sendbuttons_n.position = 0;
      sendbuttons_n.buttons = gui_buttons_faulty_msg;
      sendbuttons_n.addmode = "after";
      sendbuttons_n.senderr = true;
      sendbuttons_n.emit("input", msg_big_4);
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
