/*
* Umi Syam - Internet of Things FOODEVOTION
* Main UDP Client File
*/

//======================UDP CLIENT SETUP
var HOST = '192.168.1.120';
var PORT = 33333;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

//============ PARSE SETUP
var Parse = require('node-parse-api').Parse;
var APP_ID = "X9ryKsgWJ68DhkJOcrjIfnlyL1HHo3iNZpfWnzne";
var MASTER_KEY = "gz7ISbhssPWu0AT1rJwXHOnpoh5yH0IMZT5eQcC8";
var appParse = new Parse(APP_ID, MASTER_KEY);

//======================EXPRESS SETUP
var io = require("socket.io").listen(server);

fs = require('fs'); 
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var eport = 3000;// this is express port

var server = app.listen(eport, function() {
    console.log('Listening on port %d', server.address().port);
});

var io = require("socket.io").listen(server);


// var server = require('http').createServer(app); 

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// server.listen(eport);
// console.log("Server listening on express port %s", eport);



// setup JSON for saving text & images
var basic_json = {images:[]};
var basic_json_string = JSON.stringify(basic_json_string);
var basic_json2 = {text:[]};
var basic_json2_string = JSON.stringify(basic_json2_string);

//=======================UDP CONNECTION=================
/**
 * simple example on how to POST data from
 * frontend to backend
 * this example writes an image see
 * http://stackoverflow.com/questions/5867534/how-to-save-canvas-data-to-file
 */
 
// TODO check if images.json exists!
fs.statSync(__dirname + '/public/images.json', function(err, stat) {
  if(err === null) {
    console.log('File exists');
  } else if (err.code === 'ENOENT') {
    fs.writeFileSync('images.json', basic_json_string);
    console.log('Wrote new images.json file');
  } else { console.log('some other error', err.code);
}
});

//text.json
fs.statSync(__dirname + '/public/text.json', function(err, stat) {
  if(err === null) {
    console.log('File exists');
  } else if (err.code === 'ENOENT') {
    fs.writeFileSync('text.json', basic_json2_string);
    console.log('Wrote new text.json file');
  } else { console.log('some other error', err.code);
}
});

// http://stackoverflow.com/questions/17699599/node-js-check-exist-file
var images = fs.readFileSync(__dirname + "/public/images.json", "utf8");
var json = JSON.parse(images);
var text = fs.readFileSync(__dirname + "/public/text.json", "utf8");
var json2 = JSON.parse(text);

//console.log(json);
//console.log(json2);

app.use('/', express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

//SAVE to text.json and images.json
app.post('/save',function(req, res){
  // console.log(req.body); // let us see what is in our whole body
  // replace the data:image thing with nothing
  var data = req.body.data.replace(/^data:image\/\w+;base64,/, "");
  // data = req.body.data.replace(/ /g, '+');
  var buf = new Buffer(data, 'base64'); // new buffer with data
  // write the file async
  var ndx = json.images.length;
  var name  = 'image'+ndx+'.png';
  var imgpath = '/public/images/' + name;
  var imgpath_clean = '/images/' + name;

  var imageCaption = req.body.imageCaption;
  console.log(imageCaption);
  json2.text.push(imageCaption);
  fs.writeFileSync(__dirname + '/public/text.json',  JSON.stringify(json2));

  fs.writeFileSync(__dirname + imgpath, buf);
  // if there is no error redirect the user to the root
  console.log('wrote file to ' + imgpath); // log what we have done
  json.images.push(name);
  fs.writeFileSync(__dirname + '/public/images.json', JSON.stringify(json));
  // you could also show the image like this
  // res.send('Message received from <img src="/images/image.png">');
  
  var message = imageCaption + ',' + imgpath_clean;
  // Send message to the server
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT); 
  });

  res.redirect('/'); // redirect to the root to start over
  console.log("AFTER REDIRECT");

});


io.sockets.on('connection', function (socket) {
  console.log("We have a new client: " + socket.id);

  socket.on('getFromParse', function (data) {
    var query = {
      limit: 1000,
      // skip: 5,
      order: '-createdAt'
    };

    appParse.find('foodevotion', query, function (err, response) {
      // console.log(response);
      socket.emit('toScreen',{ ParseData: response });
    });
  });

  socket.on('disconnect', function() {
        console.log("Client has disconnected");
    });

});   // end of io.sockets.on('connection')





