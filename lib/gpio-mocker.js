var fs = require('fs');

var PATH_CPUINFO = '/proc/cpuinfo';
var PATH_GPIO = '/sys/class/gpio';
var PATH_W1_DEVICES = '/sys/bus/w1/devices';

var DEFAUT_CPUINFO = 'Processor       : ARMv6-compatible processor rev 7 (v6l) \n\
BogoMIPS        : 697.95 \n\
Features        : swp half thumb fastmult vfp edsp java tls \n\
CPU implementer : 0x41 \n\
CPU architecture: 7 \n\
CPU variant     : 0x0 \n\
CPU part        : 0xb76 \n\
CPU revision    : 7 \n\
    \n\
Hardware        : BCM2708 \n\
Revision        : 0003 \n\
Serial          : 00000000f90cbb6b';

function GPIOMocker() {
    var mockPath = null;

    // returns mockPath + suffix
    // creates missing folders
    var handlePath = function (suffix) {
        var path = mockPath + suffix;
        ;
        var folderPath = "";
        var folders = path.substring(0, path.lastIndexOf("/")).split("/");
        for (var i = 1; i < folders.length; i++) {
            folderPath += "/" + folders[i];
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }
        }

        return path;
    };

    this.setMockPath = function (path) {
        mockPath = path;
    };

    this.init = function () {
        fs.writeFileSync(handlePath(PATH_CPUINFO), DEFAUT_CPUINFO);
    };

    /**
     * Async write value of the pin.
     * @param {Number} pin Pin number (no mapping done)
     * @param {Number} value Value to set on the pin (0 or 1)
     * @param {Function} cb Callback
     */
    this.write = function (pin, value, cb) {
        fs.writeFile(handlePath(PATH_GPIO + '/gpio' + pin + '/value'), value, cb || function () {});
    };

    /**
     * Access to 1-wire sensors
     */
    this.w1 = new function () {
        var sensors = {};

        /**
         * Async write value on the W1 bus.
         * @param {String} device Arbitrary name of the device
         * @param {String|Function} sensor Name of a registered sensor or function that enhances the sensor value
         * @param {String} value Value given to the sensor function
         * @param {Function} cb Callback
         */
        this.write = function (device, sensor, value, cb) {
            if (typeof sensor == 'string' && !sensors[sensor]) throw new Error('Unknown sensor ' + sensor);

            var sensorFct = typeof sensor == 'function' ? sensor : sensors[sensor];
            fs.writeFile(handlePath(PATH_W1_DEVICES + '/' + device + '/w1_slave'), sensorFct(value), cb || function (err) {
            });
        };

        /**
         * Register a new sensor: mainly a function that will transform an input value (example: a temperature) into the
         * value writen on the bus (something close to the Raspberry Pi output)
         * @param {String} name Name of the sensor
         * @param {Function} fct Sensor implementation
         */
        this.registerSensor = function (name, fct) {
            sensors[name] = fct;
        };
    }();
};

var mocker = new GPIOMocker();

module.exports = function (options) {
    if (!options || !options.path) throw new Error('Unspecified path option');

    DEFAUT_CPUINFO = options.defaultCPUInfo || DEFAUT_CPUINFO;

    mocker.setMockPath(options.path);
    mocker.init();
    return mocker;
};