/*  P5 sketch.js file  
*   Umi Syam - November 2015
*   Internet of Things
*/

var socket;
var num;
var arrayResult;
var countPizza, countSushi, countSteak, countBurger, countBacon;
var h,s,b;
var arrayPizza = [], arraySushi = [], arraySteak = [], arrayBurger = [], arrayBacon = [];
var imgPizza, imgSushi, imgSteak, imgBurger, imgBacon;

function setup() {
  createCanvas(windowWidth, windowHeight - 100);
  colorMode(HSB, 360, 100, 100);
  
  h = 0; s = 0; b = 100;

  imgPizza = loadImage("../images/pizza.png");
  imgSushi = loadImage("../images/sushi.png");
  imgSteak = loadImage("../images/steak.png");
  imgBurger = loadImage("../images/burger.png");
  imgBacon = loadImage("../images/bacon.png"); 

  socket = io.connect('http://192.168.1.136:5000');

  socket.on('pizzaStat', function (data) {
    console.log(data);  
    countPizza = data.PizzaStat.count;
    console.log("amount of people craving Pizza = " + countPizza);
    $("#piz").html(countPizza);
    
    for (var i=0; i<countPizza+1; i++) {
      var humd = data.PizzaStat.results[i].Humidity;
      assignBubbleColor(humd);
      arrayPizza.push(new Bubble(countPizza/2, h, s, b, 1));
    }
    
  });

  socket.on('sushiStat', function (data) {
    console.log(data);  
    countSushi = data.SushiStat.count;
    console.log("amount of people craving Sushi = " + countSushi);
    $("#sus").html(countSushi);

    for (var i=0; i<countSushi+1; i++) {
      var humd = data.SushiStat.results[i].Humidity;
      assignBubbleColor(humd);
      arraySushi.push(new Bubble(countSushi/2, h, s, b, 2));
    }
    
  });

  socket.on('steakStat', function (data) {
    console.log(data);  
    countSteak = data.SteakStat.count;
    console.log("amount of people craving Steak = " + countSteak);
    $("#ste").html(countSteak);

    for (var i=0; i<countSteak+1; i++) {
      var humd = data.SteakStat.results[i].Humidity;
      assignBubbleColor(humd);
      arraySteak.push(new Bubble(countSteak/2, h, s, b, 3));
    }
    
  });

  socket.on('burgerStat', function (data) {
    console.log(data);  
    countBurger = data.BurgerStat.count;
    console.log("amount of people craving Burger = " + countBurger);
    $("#bur").html(countBurger);

    for (var i=0; i<countBurger+1; i++) {
      var humd = data.BurgerStat.results[i].Humidity;
      assignBubbleColor(humd);
      arrayBurger.push(new Bubble(countBurger/2, h, s, b, 4));
    }
    
  });

  socket.on('baconStat', function (data) {
    console.log(data);  
    countBacon = data.BaconStat.count;
    console.log("amount of people craving Bacon = " + countBacon);
    $("#bac").html(countBacon);

    for (var i=0; i<countBacon+1; i++) {
      var humd = data.BaconStat.results[i].Humidity;
      assignBubbleColor(humd);
      arrayBacon.push(new Bubble(countBacon/2, h, s, b, 5));
    }
    
  });

  socket.on('toScreen', function (data) {
    // console.log(data);
    arrayResult = data.ParseData.results;

    num = Object.keys(arrayResult).length;
    if (num == 1) {num=0;}

    var latestHumid = arrayResult[parseInt(num)-1].Humidity;
    var latestTempe = arrayResult[parseInt(num)-1].Temperature;
    console.log("total entries in our Parse database = " + num);

    $("#temperature").html(latestTempe);
    $("#humidity").html(latestHumid);

  });
  
}

function draw() {
  background(10);

  for (var i=0; i<arrayPizza.length; i++) {
    arrayPizza[i].run();
  }
  for (var i=0; i<arraySushi.length; i++) {
    arraySushi[i].run();
  }
  for (var i=0; i<arraySteak.length; i++) {
    arraySteak[i].run();
  }
  for (var i=0; i<arrayBurger.length; i++) {
    arrayBurger[i].run();
  }
  for (var i=0; i<arrayBacon.length; i++) {
    arrayBacon[i].run();
  }
}

// function toParse(){
//   console.log("You can now click the button to get sensor data! NOW");
//   socket.emit('sendToParse', {  });
// }

function fromParse(){
  console.log("Get data from Parse");
  socket.emit('getFromParse', {  });
  socket.emit('getPizzaStat', {  });
  socket.emit('getSushiStat', {  });
  socket.emit('getSteakStat', {  });
  socket.emit('getBurgerStat', {  });
  socket.emit('getBaconStat', {  });
}

// Bubble class
// function Bubble(radius) {
var Bubble = function(radius, h, s, b, mode) {
  this.x = random(0, width);
  this.y = random(0, height);
  this.radius = radius;
  this.speed = 1;
  // this.bubColor = bubColor;
  this.h = h;
  this.s = s;
  this.b = b;
  this.mode = mode;
  // this.speed = createVector(random(-1, 1), random(-1, 0));
};
Bubble.prototype.run = function() {
// this.run = function() {
  this.update();
  this.display();
};

Bubble.prototype.update = function(){
// this.update = function() {  
  this.x += random(-this.speed, this.speed);
  this.y += random(-this.speed, this.speed);
};

// Method to display
Bubble.prototype.display = function() {
  stroke(0, 0, 25);
  strokeWeight(0.5);
  
  fill(this.h, this.s, this.b);
  ellipse(this.x, this.y, this.radius, this.radius);
  
  switch(this.mode) {
    case 1:
      image(imgPizza, this.x - this.radius/2 + 2, this.y - this.radius/2 + 2, this.radius-5, this.radius-5);
      break;
    case 2:
      image(imgSushi, this.x - this.radius/2 + 2, this.y - this.radius/2 + 2, this.radius-5, this.radius-5);
      break;
    case 3:
      image(imgSteak, this.x - this.radius/2 + 2, this.y - this.radius/2 + 2, this.radius-5, this.radius-5);
      break;
    case 4:
      image(imgBurger, this.x - this.radius/2 + 2, this.y - this.radius/2 + 2, this.radius-5, this.radius-5);
      break;
    case 5:
      image(imgBacon, this.x - this.radius/2 + 2, this.y - this.radius/2 + 2, this.radius-5, this.radius-5);
      break;
    default:
      
      break;
  }
};

function assignBubbleColor(humd) {
  switch(humd) {
    case "22.00":
      // bubbleColor = '#f7d229';
      // bubbleColor = color(181, 100, 84);
      h = 181; s = 100; b = 84;
      break;
    case "23.00":
      // bubbleColor = '#01d899';
      // bubbleColor = color(162, 99, 85);
      h = 162; s = 100; b = 85;
      break;
    case "24.00":
      // bubbleColor = '#f8d22a';
      // bubbleColor = color(55, 60, 100);
      h = 55; s = 60; b = 100;
      break;
    case "25.00":
      // bubbleColor = '#ffa800';
      // bubbleColor = color(40, 100, 100);
      h = 40; s = 100; b = 100;
      break;
    case "26.00":
      // bubbleColor = '#fd8c76';
      // bubbleColor = color(10, 53, 100);
      h = 10; s = 53; b = 100;
      break;
    case "27.00":
      // bubbleColor = '#f15e42';
      // bubbleColor = color(10, 75, 100);
      h = 10; s = 75; b = 100;
      break;
    default:
      // bubbleColor = '#555';
      // bubbleColor = color(0, 0, 0);
      h = 0; s = 0; b = 100;
      break;
  }
}



