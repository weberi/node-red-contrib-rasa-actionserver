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
  require("../node_modules/@node-red/nodes/core/network/21-httpin.js"),
];

describe('sendtext', function () {

  var my_text = "Hello World";
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
      "mytext": my_text,
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
      "id": "sendtext1",
      "type": "sendtext",
      "z": "a0ec99336ec6ea39",
      "name": "sendtext1",
      "position": "0",
      "positionType": "num",
      "text": "",
      "textType": "str",
      "image": "",
      "imageType": "str",
      "attachment": "",
      "attachmentType": "str",
      "senderr": false,
      "x": 180,
      "y": 500,
      "wires": [
        [
          "sendtext"
        ]
      ]
    },
    {
      "id": "sendtext",
      "type": "sendtext",
      "z": "a0ec99336ec6ea39",
      "name": "sendtext",
      "position": "",
      "positionType": "num",
      "text": "",
      "textType": "str",
      "image": "",
      "imageType": "str",
      "attachment": "",
      "attachmentType": "str",
      "senderr": false,
      "x": 320,
      "y": 600,
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
      "active": true,
      "tosidebar": true,
      "console": false,
      "tostatus": false,
      "complete": "false",
      "statusVal": "",
      "statusType": "auto",
      "x": 540,
      "y": 600,
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

  it('should be loaded', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendtext_n = helper.getNode("sendtext");
      sendtext_n.should.have.property('name', 'sendtext');
      done();
    });
  });

  it('should send a text response given as text in GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendtext_n = helper.getNode("sendtext");

      sendtext_n.position = 1;
      sendtext_n.textType = "str";
      sendtext_n.text = my_text;

      var helpern = helper.getNode("helper");
      sendtext_n.receive(msg_big);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(2);
          msg.responses[1].should.have.property("text");
          msg.responses[1].text.should.equal(my_text);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should send a text response given as json path  in GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendtext_n = helper.getNode("sendtext");

      sendtext_n.position = 0;
      sendtext_n.textType = "msg";
      sendtext_n.text = "payload.mytext";

      var helpern = helper.getNode("helper");
      sendtext_n.receive(msg_big);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(2);
          msg.responses[0].should.have.property("text");
          msg.responses[0].text.should.equal(my_text);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should send two responses at specified  position ', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendtext_n = helper.getNode("sendtext");
      var sendtext1_n = helper.getNode("sendtext1");
      var helpern = helper.getNode("helper");

      sendtext_n.position = 1;
      sendtext_n.textType = "msg";
      sendtext_n.text = "payload.mytext";

      sendtext1_n.position = 2;
      sendtext1_n.textType = "str";
      sendtext1_n.text = "text at last pos";

      sendtext1_n.receive(msg_big);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(3);
          msg.responses[1].should.have.property("text");
          msg.responses[1].text.should.equal(my_text);

          msg.should.have.property("responses");
          msg.responses[2].should.have.property("text");
          msg.responses[2].text.should.equal(sendtext1_n.text);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});


