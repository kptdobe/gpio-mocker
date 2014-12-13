module.exports = function (options) {
    var mocker = require('./lib/gpio-mocker')(options);
    require('./lib/DS18B20-sensor')(mocker);

    return mocker;
};