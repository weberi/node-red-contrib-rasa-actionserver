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


  var msg_big_1 =
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

  var gui_buttons_ok_msg = [
    {
      "title": "payload.buttontitle1",  // No, thanks
      "title-type": "msg",
      "payload": "payload.buttonpayload1",    // "/goodbye",
      "payload-type": "msg"
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


  var expected_response =
    [
      {
        "title": "No, thanks",
        "payload": "/goodbye"
      },
      {
        "title": "I have more questions",
        "payload": "/hello"
      },
      {
        "title": "Please tell me more",
        "payload": "/inform_location"
      }
    ];

  it('should be loaded', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      sendbuttons_n.should.have.property('name', 'sendbuttons');
      done();
    });
  });

  it('should add three buttons given as text from GUI to the response', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");
      sendbuttons_n.position = 0;
      sendbuttons_n.buttons = gui_buttons_ok_text;

      sendbuttons_n.receive(msg_big_1);
      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(1);
          msg.responses[0].should.have.property('buttons');
          msg.responses[0].should.have.property('buttons', expected_response);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should add the text and three buttons to the response', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");
      sendbuttons_n.position = 1;
      sendbuttons_n.text = "How to proceed?" ;
      sendbuttons_n.buttons = gui_buttons_ok_text;

      sendbuttons_n.receive(msg_big_1);
      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(2);
          msg.responses[1].should.have.property('buttons');
          msg.responses[1].should.have.property('buttons', expected_response);
          msg.responses[1].should.have.property('text', "How to proceed?" );
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should add three buttons as msg from GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");
      sendbuttons_n.position = 1;
      sendbuttons_n.buttons = gui_buttons_ok_msg;

      sendbuttons_n.receive(msg_big_2);
      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(2);
          msg.responses[1].should.have.property('buttons');
          msg.responses[1].should.have.property('buttons', expected_response);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  var expected_buttons_before = [
    {
      "title": "I feel good",
      "payload": "/tell_happy"
    },
    {
      "title": "I feel sad",
      "payload": "/tell_sad"
    },
    {
      "title": "No, thanks",
      "payload": "/goodbye"
    },
    {
      "title": "I have more questions",
      "payload": "/hello"
    },
    {
      "title": "Please tell me more",
      "payload": "/inform_location"
    }
  ];

  var expected_buttons_after = [

    {
      "title": "No, thanks",
      "payload": "/goodbye"
    },
    {
      "title": "I have more questions",
      "payload": "/hello"
    },
    {
      "title": "Please tell me more",
      "payload": "/inform_location"
    },
    {
      "title": "I feel good",
      "payload": "/tell_happy"
    },
    {
      "title": "I feel sad",
      "payload": "/tell_sad"
    }
  ];


  it('should add buttons  from payload with option after', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");

      sendbuttons_n.position = 2;
      sendbuttons_n.buttons = gui_buttons_ok_text;
      sendbuttons_n.addmode = "after";

      sendbuttons_n.receive(msg_big_3);
      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(3);
          msg.responses[2].should.have.property('buttons');
          msg.responses[2].should.have.property('buttons', expected_buttons_after);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });


  it('should add buttons  from payload with option before', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendbuttons_n = helper.getNode("sendbuttons");
      var helper_n = helper.getNode("helper");

      sendbuttons_n.position = 0;
      sendbuttons_n.buttons = gui_buttons_ok_text;
      sendbuttons_n.addmode = "before";

      sendbuttons_n.receive(msg_big_4);
      helper_n.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(1);
          msg.responses[0].should.have.property('buttons');
          msg.responses[0].should.have.property('buttons', expected_buttons_before);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

});
