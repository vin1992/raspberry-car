let r = require('rpio');

const options = {
				  gpiomem: false,
				  mapping: 'physical',
				  mock: undefined,
}

let range = 1024;
let clockdiv = 8;
let speed = 500;
let max = 2000;
let min = 200;

let pwm_pin = 12;

let d_forward = ['HIGH', 'HIGH', 'LOW'];
let d_backward = ['HIGH', 'LOW', 'HIGH'];
let o_stop = ['HIGH', 'HIGH', 'HIGH'];

function init() {
				  r.init(options);
				  r.open(pwm_pin, r.PWM);

				  r.open(5, r.OUTPUT);
				  r.open(7, r.OUTPUT);

				  r.pwmSetClockDivider(clockdiv);
}

init();

r.pwmSetData(pwm_pin, speed);
r.write(5, r.HIGH);
r.write(7, r.LOW);

