var rewire = require('rewire');
var util = require('util');

describe('wunderground-plugin', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('createInstance should return an instance', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance).not.toBe(null);
        done();
    });

    it('createInstance should set the id', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance.id).toBe(123);
        done();
    });



    it('should create wind speed sensor', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.sensors.WIND_SPEED.controlType).toBe('value');
        expect(instance._metadata.sensors.WIND_SPEED.deviceType).toBe('other');
        expect(instance._metadata.sensors.WIND_SPEED.units).toBe('velocity');
        expect(instance._metadata.sensors.WIND_SPEED.monitor).toBe(true);

        done();
    });



    it('should create precipitation sensor', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.sensors.PRECIPITATION.controlType).toBe('value');
        expect(instance._metadata.sensors.PRECIPITATION.deviceType).toBe('other');
        expect(instance._metadata.sensors.PRECIPITATION.units).toBe('length');
        expect(instance._metadata.sensors.PRECIPITATION.monitor).toBe(true);

        done();
    });


    it('should create pressure sensor', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.sensors.PRESSURE.controlType).toBe('value');
        expect(instance._metadata.sensors.PRESSURE.deviceType).toBe('other');
        expect(instance._metadata.sensors.PRESSURE.units).toBe('pressure');
        expect(instance._metadata.sensors.PRESSURE.monitor).toBe(true);

        done();
    });



    it('should create humidity sensor', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.sensors.HUMIDITY.controlType).toBe('value');
        expect(instance._metadata.sensors.HUMIDITY.deviceType).toBe('other');
        expect(instance._metadata.sensors.HUMIDITY.units).toBe('humidity');
        expect(instance._metadata.sensors.HUMIDITY.monitor).toBe(true);

        done();
    });



    it('should create temperature sensor', function(done) {
        var plugin = rewire('../index.js');
        var instance = plugin.createInstance(123, {}, {
            resolve: function() { return {}; }
        });
        expect(instance._metadata.sensors.TEMPERATURE.controlType).toBe('value');
        expect(instance._metadata.sensors.TEMPERATURE.deviceType).toBe('thermostat');
        expect(instance._metadata.sensors.TEMPERATURE.units).toBe('temperature');
        expect(instance._metadata.sensors.TEMPERATURE.monitor).toBe(true);

        done();
    });


});
