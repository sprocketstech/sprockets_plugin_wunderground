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




    /*
    it('should update control value on change', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        changeCallback('1');
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        done();
    });


    it('should set control value on true', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: true
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('should set control value on "true"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: "true"
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(true);
        expect(setVal).toBe(1);
        done();
    });


    it('should set control value on false', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: false
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });


    it('should set control value on "false"', function(done) {
        var wemoPlugin = rewire('../index.js');
        var changeCallback = null;
        var setVal = null;
        //mock out wemoapi
        var mock = {
            getDeviceType: function(id) {
                return "Switch";
            },
            getDeviceName: function(id) {
                return "Test Switch";
            },
            getDevice: function(id) {
                return {
                    on: function(name, callback) {
                        changeCallback = callback;
                    },
                    setBinaryState: function(val) {
                        setVal = val;
                    }
                }
            }
        };

        wemoPlugin.__set__("wemoAPI", mock);
        var instance = wemoPlugin.createInstance(123, {}, {});
        instance.eventBus = {
            publish: function(messageName, data) {
            },
            subscribe: function() {}
        };

        instance.start();
        instance.setComponentValues({
            controls: {
                OUTLET_OUTPUT: {
                    value: "false"
                }
            }
        });
        expect(instance._values.controls.OUTLET_OUTPUT.value).toBe(false);
        expect(setVal).toBe(0);
        done();
    });

*/
});
