let r = require('rpio');
let clockdiv = 8;
let speed = 500;
let max = 2000;
let min = 200;
const options = {
				  gpiomem: false,
				  mapping: 'physical',
				  mock: undefined,
}
let pwm_pin = 12;
let pwm_pin1 = 35;
let leftPins = [5, 7];

let range = 1024;
let rightPins = [38, 40];

let d_forward = ['HIGH', 'HIGH', 'LOW'];
let d_backward = ['HIGH', 'LOW', 'HIGH'];
let o_stop = ['HIGH', 'HIGH', 'HIGH'];

function init() {
				  r.init(options);
				  r.open(pwm_pin, r.PWM);
				  r.open(pwm_pin1, r.PWM);

				  r.pwmSetClockDivider(clockdiv);
				  r.pwmSetRange(pwm_pin, range);
				  r.pwmSetRange(pwm_pin1, range);
				  r.pwmSetData(pwm_pin, speed);
				  r.pwmSetData(pwm_pin1, speed);

				  let tmp = leftPins.concat(rightPins);
				  tmp.forEach(pin => {
									    r.open(pin, r.OUTPUT);
									  })
}

function leftMotor(arr) {
				  r.write(pwm_pin, r[arr[0]]);
				  r.write(5, r[arr[1]]);
				  r.write(7, r[arr[1]]);
}

function rightMotor(arr) {
				  r.write(pwm_pin1, r[arr[0]]);
				  r.write(38, r[arr[1]]);
				  r.write(40, r[arr[2]]);
}

function forward() {
				  leftMotor(d_forward);
				  rightMotor(d_forward);
}

function backward() {
				  leftMotor(d_backward);
				  rightMotor(d_backward);
}

function left() {
				  leftMotor(d_backward);
				  rightMotor(d_forward);
}

function right() {
				  leftMotor(d_forward);
				  rightMotor(d_backward);
}

function stop() {
				  leftMotor(o_stop);
				  rightMotor(o_stop);
}

function speedUp() {
				  if (speed <= max) {
									    speed += 100;
									    r.pwmSetData(pwm_pin, speed);
									    r.pwmSetData(pwm_pin1, speed);
									  }
}

function speedDown() {
				  if (speed >= min) {
									    speed -= 100;
									    r.pwmSetData(pwm_pin, speed);
									    r.pwmSetData(pwm_pin1, speed);
									  }
}

function getIPAddress() {
				  var interfaces = os.networkInterfaces();
				  for (var devName in interfaces) {
									    var iface = interfaces[devName];
									    for (var i = 0; i < iface.length; i++) {
															      var alias = iface[i];
															      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
																						        return alias.address;
																						      }
															    }
									  }
}

init();
forward();

