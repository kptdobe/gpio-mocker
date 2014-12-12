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