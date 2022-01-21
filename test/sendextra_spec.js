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

describe('sendextra', function () {

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
      "id": "sendextra1",
      "type": "sendextra",
      "z": "a0ec99336ec6ea39",
      "name": "sendextra1",
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
          "sendextra"
        ]
      ]
    },
    {
      "id": "sendextra",
      "type": "sendextra",
      "z": "a0ec99336ec6ea39",
      "name": "sendextra",
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

  //## hello world 
  it('should be loaded', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendextra_n = helper.getNode("sendextra");
      sendextra_n.should.have.property('name', 'sendextra');
      done();
    });
  });

  var my_text = "Hello World";

  it('should send a text response given as text in GUI', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendextra_n = helper.getNode("sendextra");

      sendextra_n.position = 1;
      sendextra_n.textType = "str";
      sendextra_n.text = my_text;

      var helpern = helper.getNode("helper");
      sendextra_n.receive({ ...msg_big });

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
      var sendextra_n = helper.getNode("sendextra");

      var msg_in = { ...msg_big };
      msg_in.payload.mytext = my_text;

      sendextra_n.position = 0;
      sendextra_n.textType = "msg";
      sendextra_n.text = "payload.mytext";

      var helpern = helper.getNode("helper");
      sendextra_n.receive(msg_in);

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

  it('should send a text response and an image response and an atttachment response', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendextra_n = helper.getNode("sendextra");

      var msg_in = { ...msg_big };
      msg_in.payload.mytext = my_text;
      msg_in.payload.myattachment = "rasa.com";

      sendextra_n.position = 1;
      sendextra_n.textType = "msg";
      sendextra_n.text = "payload.mytext";
      sendextra_n.imageType = "str";
      sendextra_n.image = "https://i.imgur.com/nGF1K8f.jpg";

      sendextra_n.attachmentType = "msg";
      sendextra_n.attachment = "payload.myattachment";


      var helpern = helper.getNode("helper");
      sendextra_n.receive(msg_in);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(2);
          msg.responses[1].should.have.property("text");
          msg.responses[1].text.should.equal(my_text);
          msg.responses[1].should.have.property("image");
          msg.responses[1].image.should.equal(sendextra_n.image);
          msg.responses[1].should.have.property("attachment");
          msg.responses[1].attachment.should.equal(msg_in.payload.myattachment);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('should send two responses at specified  position ', function (done) {
    helper.load(requiredNodes, flow, function () {
      var sendextra_n = helper.getNode("sendextra");
      var sendextra1_n = helper.getNode("sendextra1");
      var helpern = helper.getNode("helper");

      var msg_in = { ...msg_big };
      msg_in.payload.mytext = my_text;

      sendextra_n.position = 1;
      sendextra_n.textType = "msg";
      sendextra_n.text = "payload.mytext";

      sendextra1_n.position = 2;
      sendextra1_n.textType = "str";
      sendextra1_n.text = "text at last pos";

      sendextra1_n.receive(msg_in);

      helpern.on("input", (msg) => {
        try {
          msg.should.have.property("responses");
          msg.responses.should.have.length(3);
          msg.responses[1].should.have.property("text");
          msg.responses[1].text.should.equal(my_text);
          msg.should.have.property("responses");
          msg.responses[2].should.have.property("text");
          msg.responses[2].text.should.equal(sendextra1_n.text);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});


