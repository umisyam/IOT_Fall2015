/*
* Umi Syam - Internet of Things FOODEVOTION
* Main UDP Server File
*/

//============ UDP SERVER SETUP
var HOST = '192.168.1.120';
var PORT = 33333;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

//============ PARSE SETUP
var Parse = require('node-parse-api').Parse;
var APP_ID = "X9ryKsgWJ68DhkJOcrjIfnlyL1HHo3iNZpfWnzne";
var MASTER_KEY = "gz7ISbhssPWu0AT1rJwXHOnpoh5yH0IMZT5eQcC8";
var app = new Parse(APP_ID, MASTER_KEY);

//============ PRINTER SETUP
var SerialPort = require('serialport').SerialPort,
    sport = new SerialPort ('/dev/tty.usbserial-AH0331AG', {
      baudrate: 19200
    }),
Printer = require('thermalprinter');

var dataFromClient, teks, lastImage;

//============= UDP SERVER LISTENS =======================================================
server.on('listening', function () {
      var address = server.address();
      console.log('UDP Server listening on ' + address.address + ":" + address.port);
}); 

//============= SERIAL PORT OPEN + SERVER LISTENS FOR MESSAGE FROM CLIENT ================
sport.on('open',function (error) {
  if (error) {
    console.log('failed to open Serial Port: ' + error);//if serial fails
  } else {
    console.log("serialPort Printer is open");
      var opts = {
       maxPrintingDots: 7,
         heatingTime: 80, //140 //90
         heatingInterval: 8, //60 //10
         commandDelay: 0
       };

      var printer = new Printer(sport, opts);

      printer.on('ready', function() {

        server.on('message', function (message, remote) {
          console.log(remote.address + ", " + remote.port + ', ' + message);
          
          // Parse the incoming data from client
          dataFromClient = message.toString().split(',');
          teks = dataFromClient[0];
          var lastImage_clean = dataFromClient[1];
          lastImage = 'http://192.168.1.118:3000' + lastImage_clean;
          console.log("Caption: " + teks);
          console.log("Path to last image: " + lastImage);

          // Save to database
          app.insert('foodevotion', { description: teks, imagePath: lastImage_clean }, function (err, response) {
            console.log("text + imagepath saved to Parse!");
          });

          console.log("PRINTER READY TO PRINT");
          printer
            // .indent(10)
            .horizontalLine(16)
            .printImage(lastImage)
            .lineFeed(1)
            .bold(true)
            .big(true)
            .printLine(teks)
            .lineFeed(1)
            .print(function() {
              console.log('done');
              // process.exit();
            });

        }); //end of server.on('message')
      }); //end of printer.on('ready')
      
    } //end of else

}); 

server.bind(PORT, HOST);

