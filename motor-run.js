let r = require('rpio');
let http = require('http').createServer(handler);
let fs = require('fs');
let io = require('socket.io')(http);
let os = require('os');

const options = {
				gpiomem: false,
				mapping: 'physical',
				mock: undefined,
}

let range = 1024;
let clockdiv = 8;
let speed = 512;
let max = 2012;
let min = 212;

http.listen(8081);

console.log('server running successfully..');
console.log('local ip is ', getIPAddress());

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

function handler(req, res) {
				fs.readFile(__dirname + '/index.html', function(err, data) {
								if (err) {
												res.writeHead(400, { 'Content-Type': 'text/html' })
												return res.end()
								}
								res.writeHead(200, { 'Content-Type': 'text/html' })
								res.write(data);
								return res.end();
				})
}

let pwm_pin = 35;
let pwm_pin1 = 12; // 12,32,33,35

let leftPins = [5, 7];
let rightPins = [38, 40];

let d_backward = ['HIGH', 'HIGH', 'LOW'];
let d_forward = ['HIGH', 'LOW', 'HIGH'];
let o_stop = ['HIGH', 'HIGH', 'HIGH'];

function init() {
				r.init(options);
				r.open(pwm_pin, r.PWM);
				r.open(pwm_pin1, r.PWM);

				r.pwmSetClockDivider(clockdiv);
				r.pwmSetRange(pwm_pin, range);
				r.pwmSetRange(pwm_pin1, range);

				let tmp = leftPins.concat(rightPins);
				tmp.forEach(pin => {
								r.open(pin, r.OUTPUT);
				})
}

init();

io.sockets.on('connection', function(socket) {
				let value = 0;
				socket.on('option', function(data) {
								value = data;
								switch (value) {
												case 2:
																forward();
																break;
												case 8:
																backward();
																break;
												case 4:
																left();
																break;
												case 5:
																stop();
																break;
												case 6:
																right();
																break;
												case 1:
																speedUp();
																break;
												case 3:
																speedDown();
																break;
												default:
																forward();

								}
				})

				socket.emit('sendIP', getIPAddress());
})

function leftMotor(arr) {
				r.pwmSetData(pwm_pin, speed);
				r.write(5, r[arr[1]]);
				r.write(7, r[arr[2]]);
}

function rightMotor(arr) {
				r.pwmSetData(pwm_pin1, speed);
				r.write(38, r[arr[1]]);
				r.write(40, r[arr[2]]);
}

function forward() {
				leftMotor(d_forward);
				rightMotor(d_forward);
				console.log('forward');
}

function backward() {
				leftMotor(d_backward);
				rightMotor(d_backward);
				console.log('backward');

}

function right() {
				leftMotor(d_backward);
				rightMotor(d_forward);
				console.log('right');

}

function left() {
				leftMotor(d_forward);
				rightMotor(d_backward);
				console.log('left');

}

function stop() {
				leftMotor(o_stop);
				rightMotor(o_stop);
				console.log('stop')
}

function speedUp() {
				if (speed <= max) {
								speed += 100;
								console.log('speed', speed);
								r.pwmSetData(pwm_pin, speed);
								r.pwmSetData(pwm_pin1, speed);
				}
}

function speedDown() {
				if (speed >= min) {
								speed -= 100;
								console.log('speed', speed);

								r.pwmSetData(pwm_pin, speed);
								r.pwmSetData(pwm_pin1, speed);
				}
}

