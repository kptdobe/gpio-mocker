module.exports = function (mocker) {
    mocker.w1.registerSensor('DS18B20', function (value) {
        return '0d 01 4b 46 7f ff 03 10 91 : crc=91 YES' +
            '\n0d 01 4b 46 7f ff 03 10 91 t=' + (value * 1000);
    });
};