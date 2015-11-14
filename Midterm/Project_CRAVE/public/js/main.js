/*  Main.js client file  
*   Umi Syam - November 2015
*   Internet of Things
*/

var vidArray = [];

var socket = io.connect('http://192.168.1.136:5000');

function toParse(){
  console.log("You can now click the button to get sensor data! NOW");
  socket.emit('sendToParse', {  });
}

function showVid(vidobj){
  // $("#results").append('<div><iframe src="http://www.youtube.com/embed?listType=search&amp;list=movie+trailers+2012" frameborder="0" allowfullscreen></iframe></div>');
  $("#results").append('<div><iframe id="YTvideo" src="https://www.youtube.com/embed/' + vidobj.vidid + '?modestbranding=1&rel=0&controls=0&autoplay=1&showinfo=0&autohide=1" frameborder="0" muted="muted" allowfullscreen></iframe></div>');
}

function getMoreData(vidid, index){
  //can add contentDetails for duration
  var url = "https://www.googleapis.com/youtube/v3/videos?part=statistics&key=AIzaSyBN3G_rd_zDkU8WNbM7Nripv0-Q0Vw3CkE&id=" + vidid;
  $.get(url, function( data ) {
    var convert = numberWithCommas(data.items[0].statistics.viewCount);
    vidArray[index].views = convert;
    showVid(vidArray[index]);
    // onYouTubePlayerAPIReady(vidArray[index]);
  });
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getData(){
  var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&order=relevance&videoDuration=short&type=video&q=foodporn|pizza|sushi|steak|burger|bacon&order=viewCount&key=AIzaSyBN3G_rd_zDkU8WNbM7Nripv0-Q0Vw3CkE";
  // var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&order=relevance&videoDuration=short&publishedAfter=2015-10-06T00%3A00%3A00Z&q=foodporn|pizza|sushi|steak|burger|bacon&order=viewCount&key=AIzaSyBN3G_rd_zDkU8WNbM7Nripv0-Q0Vw3CkE";

  $.get(url, function( data ) {
    console.log(data);
    for (var i = 0; i < data.items.length; i++) {
      var obj = {
        vidid: data.items[i].id.videoId,
        published: data.items[i].snippet.publishedAt
      }
      vidArray[i] = obj;
      getMoreData(obj.vidid, i);
    }
    console.log(vidArray);
  });
}

$(document).ready(function(){
  var interval = setInterval(function(){
    $(".blink").animate({opacity:0},200,"linear",function(){
      $(this).animate({opacity:1},200);
    });
  }, 100);

  

  $( "#toParse" ).click(function() {
    $("#hello").fadeOut();
    $("#topBar").fadeIn();
    $("#results").fadeIn();
    getData();
  });

  // setTimeout(function(){
  //   $("#hello").fadeOut();
  //   $("#topBar").fadeIn();
  //   $("#results").fadeIn();
  //   clearInterval(interval);
  // }, 5000);
});


// 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');
// tag.src = "http://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubePlayerAPIReady(vidobj) {
//   player = new YT.Player('player', {
//     playerVars: { 'autoplay': 1, 'controls': 1,'autohide':1,'wmode':'opaque' },
//     videoId: vidobj.vidid,
//     events: {
//       'onReady': onPlayerReady}
//   });
// }

// 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//   event.target.mute();
// }

