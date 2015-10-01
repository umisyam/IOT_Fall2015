/* Umi Syam */

var GPIO = require('onoff').Gpio,
    led1 = new GPIO(17, 'out');
    led2 = new GPIO(27, 'out');
    button1 = new GPIO(4,'in');
    button2 = new GPIO(18, 'in');

//////////////////define the flash callback function///////////////////
function turnonoff() {
  if(state == 1) {
    // turn LED on
    led1.writeSync(1);
    state=0;
  } else {
    // turn LED off
    led1.writeSync(0);
    state=1;
  }
}

function blink() {
  if(state == 1) {
    // turn LED on
    led2.writeSync(1);
    state=0;
  } else {
    // turn LED off
    led2.writeSync(0);
    state=1;
    setInterval(function(){
      blink();
    }, 3000);
  }
}
led1.writeSync(1);
// button1.watch(turnonoff);
// button2.watch(blink);