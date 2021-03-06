gpio-mocker
===========

NodeJS module to mock the GPIO on a non Raspberry Pi system. Useful for development and to simulate i/o without having to physically wire the cables to test apps.
[Extended](https://github.com/kptdobe/rpi-gpio.js) [rpi-gpio.js from James Barwell](https://github.com/JamesBarwell/rpi-gpio.js.git) to work with this mocker.

Sample:
```js
//mock the GPIO inside a folder 'mocks' of the current folder
var mocker = require('./index')({path: __dirname + '/mocks'});

//write 1 on pin 4
mocker.write(4, 1, function(err) {
    if ( err != null ) {
        console.log('Error',err);
    } else {
        console.log('Successfully wrote 1 to pin 4');
    }
});

//write a temperature to simulate a DS18B20 sensor
mocker.w1.write('mydevice', 'DS18B20', 23, function(err) {
    if ( err != null ) {
        console.log('Error',err);
    } else {
        console.log('Successfully wrote to mydevice');
    }
});
```
