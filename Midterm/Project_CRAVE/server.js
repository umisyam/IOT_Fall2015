/*  Server.js file
*   Umi Syam - November 2015
*   Internet of Things
*/

///Parse data
var Parse = require('node-parse-api').Parse;
var APP_ID = "X9ryKsgWJ68DhkJOcrjIfnlyL1HHo3iNZpfWnzne";
var MASTER_KEY = "gz7ISbhssPWu0AT1rJwXHOnpoh5yH0IMZT5eQcC8";
var appParse = new Parse(APP_ID, MASTER_KEY);

// Initiate all GPIO pins
var Gpio = require('onoff').Gpio,
    // capTouch = new Gpio(23, 'in', 'both'),
    // led0 = new Gpio(5, 'out'),
    // led1 = new Gpio(6, 'out'),
    // led2 = new Gpio(13, 'out'),
    // led3 = new Gpio(19, 'out'),
    // led4 = new Gpio(26, 'out'),
    button = new Gpio(18, 'in', 'both'),
    pad0 = new Gpio(22, 'in', 'both'),
    pad1 = new Gpio(21, 'in', 'both'),
    pad2 = new Gpio(17, 'in', 'both'),
    pad3 = new Gpio(24, 'in', 'both'),
    pad4 = new Gpio(23, 'in', 'both');


// node package to work with DHT11 Humidity and Temperature sensor 
var sensorLib = require('node-dht-sensor');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});

var io = require("socket.io").listen(server);
var dht_sensor, localTemp, localHumid;

// Configure default folder for front-end HTML
app.use(express.static(__dirname + '/public'))

// Serve interface
app.get('', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('YOUR SERVER IS RUNNING')
})
app.get('/visualize', function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end('this is your about page')
})

io.sockets.on('connection', function (socket) {
  console.log("We have a new client: " + socket.id);

  socket.on('sendToParse', function (data) {
    // Make measurements from sensors
    dht_sensor = {
        initialize: function () {
            return sensorLib.initialize(11, 4);
        },
        read: function () {
            var readout = sensorLib.read();
            localTemp = readout.temperature.toFixed(2);
            localHumid = readout.humidity.toFixed(2);
            
            console.log('Temperature: ' + localTemp + 'C, ' +
                'humidity: ' + localHumid + '%');
        }
    };

    button.watch(function(err, value) {
          if (err) exit();
          // led0.writeSync(value);

          //first check if the button is pressed, then read the sensor data
          if (value == 1) readTempSensor();
    });

    pad0.watch(function(err, value) {
        if (err) exit();
        // led0.writeSync(value);

        if (value == 1) {
            console.log("Pad 0 pressed!!");
            readTempSensor();

            appParse.insert('testMidterm', 
                { Temperature: localTemp, Humidity: localHumid, FoodTerm: "bacon" }, function (err, response) {
                  console.log("bacon craving detected");
                });
        }
    });

    pad1.watch(function(err, value) {
        if (err) exit();
        // led1.writeSync(value);
        if (value == 1) {
            console.log("Pad 1 pressed!!");
            readTempSensor();

            appParse.insert('testMidterm', 
                { Temperature: localTemp, Humidity: localHumid, FoodTerm: "burger" }, function (err, response) {
                  console.log("burger craving detected");
                });
        }
    });

    pad2.watch(function(err, value) {
        if (err) exit();
        // led2.writeSync(value);
        if (value == 1) {
            console.log("Pad 2 pressed!!");
            readTempSensor();

            appParse.insert('testMidterm', 
                { Temperature: localTemp, Humidity: localHumid, FoodTerm: "steak" }, function (err, response) {
                  console.log("steak craving detected");
                });
        }
    });

    pad3.watch(function(err, value) {
        if (err) exit();
        // led3.writeSync(value);
        if (value == 1) {
            console.log("Pad 3 pressed!!");
            readTempSensor();

            appParse.insert('testMidterm', 
                { Temperature: localTemp, Humidity: localHumid, FoodTerm: "sushi" }, function (err, response) {
                  console.log("sushi craving detected");
                });
        }
    });

    pad4.watch(function(err, value) {
        if (err) exit();
        // led4.writeSync(value);
        if (value == 1) {
            console.log("Pad 4 pressed!!");
            readTempSensor();

            appParse.insert('testMidterm', 
                { Temperature: localTemp, Humidity: localHumid, FoodTerm: "pizza" }, function (err, response) {
                  console.log("pizza craving detected");
                });
        }
    });

  });


  socket.on('getFromParse', function (data) {
    var query = {
      limit: 1000,
      // skip: 5,
      order: '-createdAt'
    };

    appParse.find('testMidterm', query, function (err, response) {
      // console.log(response);
      socket.emit('toScreen',{ ParseData: response });
    });
  });

  socket.on('getPizzaStat', function (data) {
    var query = {
      where: { FoodTerm: 'pizza' },
      count: 1,
      limit: 1000
    };

    appParse.find('testMidterm', query, function (err, response) {
      socket.emit('pizzaStat',{ PizzaStat: response });
    });
  });

  socket.on('getSushiStat', function (data) {
    var query = {
      where: { FoodTerm: 'sushi' },
      count: 1,
      limit: 1000
    };

    appParse.find('testMidterm', query, function (err, response) {
      socket.emit('sushiStat',{ SushiStat: response });
    });
  });

  socket.on('getSteakStat', function (data) {
    var query = {
      where: { FoodTerm: 'steak' },
      count: 1,
      limit: 1000
    };

    appParse.find('testMidterm', query, function (err, response) {
      socket.emit('steakStat',{ SteakStat: response });
    });
  });

  socket.on('getBurgerStat', function (data) {
    var query = {
      where: { FoodTerm: 'burger' },
      count: 1,
      limit: 1000
    };

    appParse.find('testMidterm', query, function (err, response) {
      socket.emit('burgerStat',{ BurgerStat: response });
    });
  });

  socket.on('getBaconStat', function (data) {
    var query = {
      where: { FoodTerm: 'bacon' },
      count: 1,
      limit: 1000
    };

    appParse.find('testMidterm', query, function (err, response) {
      socket.emit('baconStat',{ BaconStat: response });
    });
  });

  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });

}); //end of io.sockets.on('connection')
 
function readTempSensor() {
    if (dht_sensor.initialize()) {
        dht_sensor.read();
    } else {
        console.warn('Failed to initialize sensor');
    }
}

function exit() {
  // led0.unexport();
  // led1.unexport();
  // led2.unexport();
  // led3.unexport();
  // led4.unexport();
  button.unexport();
  pad0.unexport();
  pad1.unexport();
  pad2.unexport();
  pad3.unexport();
  pad4.unexport();
  process.exit();
}
 
process.on('SIGINT', exit);

