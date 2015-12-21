/*
* Umi Syam - Internet of Things FOODEVOTION
* Main JS File
*/

var app = app || {};

app.main = (function() {
  console.log('Your code starts here!');

  var arrayResult;
  var socket = io.connect('http://192.168.1.118:3000'); //the client's IP address

  //Counting remaining characters of the text area
  $(".char-textarea").on("keyup",function(event){
    checkTextAreaMaxLength(this,event);
  });

  function checkTextAreaMaxLength(textBox, e) { 
      var maxLength = parseInt($(textBox).data("length"));
      if (!checkSpecialKeys(e)) { 
        if (textBox.value.length > maxLength - 1) textBox.value = textBox.value.substring(0, maxLength); 
      } 
      $(".char-count").html(maxLength - textBox.value.length);
      return true; 
  } 
  
  //Checks if the keyCode pressed is inside special chars
  function checkSpecialKeys(e) { 
      if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) 
          return false; 
      else 
          return true; 
  }


  function submitForm() {
    $('form').submit(function (event){
      var str = $('#sketch')[0].toDataURL();
      console.log(str);
      
      $('input#mydata').val(str);
      return true;
    });
  }

  function loadFromParse() {
    socket.emit('getFromParse', {  });
  }

  socket.on('toScreen', function (data) {
    console.log(data);
    arrayResult = data.ParseData.results;

    num = Object.keys(arrayResult).length;
    console.log("total entries in our Parse database = " + num);

    // if i only wanna show 1 result
    // if (num == 1) {num=0;}
    // var latestText = arrayResult[parseInt(num)-1].description;
    // var latestImage = arrayResult[parseInt(num)-1].imagePath;
    // $("#textupload").append(latestText);
    // $("#upload").append("<img src='http://149.31.199.132:3000"+latestImage+ "'>");

    //if i wanna show a gallery thumbnails
    for (var i=0; i<num; i++) {
      var desc = arrayResult[i].description;
      var imej = arrayResult[i].imagePath;

      $("#gallery").append("<li id='overlay'><img src='http://192.168.1.118:3000"+ imej + "'><div id='overlayText'><span id='plus'>" + desc + "</span></div></li>");
    }

  });

  var init = function(){
    console.log('Initializing app.');
    submitForm();
    loadFromParse();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);

