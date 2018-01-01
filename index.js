"use strict";

var util = require('util');
var SDK = require('sprockets-sdk');
var requestify = require('requestify');

var TEMPERATURE_ID = 'TEMPERATURE';
var HUMIDITY_ID = 'HUMIDITY';
var PRESSURE_ID = 'PRESSURE';
var PRECIPITATION_ID = 'PRECIPITATION';
var WIND_SPEED_ID = 'WIND_SPEED';
var CONDITIONS_ID = 'CONDITIONS';
var FORECAST_ID = 'FORECAST';

var WeatherInstance = function(id, config, services) {
    SDK.Devices.DeviceInstance.call(this, id);
    this.scheduler = services.resolve('scheduler');
    this.config = config;
    this.job = null;
    this.forecastJob = null;
    //add the metadata
    this.addSensor(new SDK.Devices.DeviceValueComponent(CONDITIONS_ID, 'Conditions', SDK.ValueType.OTHER, SDK.DeviceType.OTHER, false));
    this.addSensor(new SDK.Devices.DeviceValueComponent(FORECAST_ID, 'Forecast', 'string', SDK.DeviceType.OTHER, false));

    this.addSensor(new SDK.Devices.DeviceValueComponent(TEMPERATURE_ID, 'Temperature', SDK.ValueType.TEMPERATURE, SDK.DeviceType.THERMOSTAT));
    this.addSensor(new SDK.Devices.DeviceValueComponent(HUMIDITY_ID, 'Humidity', SDK.ValueType.HUMIDITY, SDK.DeviceType.OTHER));
    this.addSensor(new SDK.Devices.DeviceValueComponent(PRESSURE_ID, 'Pressure', SDK.ValueType.PRESSURE, SDK.DeviceType.OTHER));
    this.addSensor(new SDK.Devices.DeviceValueComponent(PRECIPITATION_ID, 'Precipitation', SDK.ValueType.LENGTH, SDK.DeviceType.OTHER));
    this.addSensor(new SDK.Devices.DeviceValueComponent(WIND_SPEED_ID, 'Wind Speed', SDK.ValueType.VELOCITY, SDK.DeviceType.OTHER));
};

util.inherits(WeatherInstance, SDK.Devices.DeviceInstance);

/*Overrides of Device Instance */

WeatherInstance.prototype.start = function() {
    //create a scheduled job to poll the API every 1/2 hour
    var schedule = {seconds: 60*30};
    this.job = this.scheduler.scheduleJob("PollWunderground_" + this.id, schedule, function(time, obj) {
        obj._updateValues();
    }, this);
    this.forecastJob = this.scheduler.scheduleJob('PollWundergroundForecast_' + this.id, {minute: 0, hour:3}, function(time, obj) {
        obj._updateForecast();
    }, this);
    //grab the current values
    this._updateValues();
    this._updateForecast();
};

WeatherInstance.prototype.shutdown = function() {
    //on shutdown, cancel the scheduled job
    if (this.job) {
        this.scheduler.cancel(this.job);
    }
    if (this.forecastJob) {
        this.scheduler.cancel(this.forecastJob);
    }
};


WeatherInstance.prototype.setComponentValues = function(newVals) {
    //no op, can't set the weather can we?
};

WeatherInstance.prototype._updateForecast = function() {
    var that = this;
    //poll the service
    //The url we want is: http://api.wunderground.com/api/d0666bf6fa9e90a4/conditions/q/CA/San_Francisco.json
    var url = 'http://api.wunderground.com/api/' + that.config.apiKey + '/forecast/q/CA/' + that.config.location + '.json';
    requestify.get(url, {
        dataType: 'json'
    }).then(function (response) {
        //grab the values
        var values = response.getBody();
        var retVal = [];
        var forecast = values.forecast.simpleforecast.forecastday;
        var textforecast = values.forecast.txt_forecast.forecastday;
        for (var k = 0; k < forecast.length; ++k) {
            retVal.push({
                title: textforecast[k*2].title,
                icon: 'wu-' + forecast[k].icon,
                conditions: forecast[k].conditions,
                text: textforecast[k*2].fcttext,
                high: forecast[k].high.fahrenheit,
                low: forecast[k].low.fahrenheit,
            });
        }

        that.updateSensorValue(FORECAST_ID, retVal);

    }).catch(function (err) {
        this.loggingService.error('Error Wunderground ' + this.id() + ': ' + err.message, err.stack);
    });
};

WeatherInstance.prototype._updateValues = function() {
    var that = this;
    //poll the service
    //The url we want is: http://api.wunderground.com/api/d0666bf6fa9e90a4/conditions/q/CA/San_Francisco.json
    var url = 'http://api.wunderground.com/api/' + that.config.apiKey + '/conditions/q/CA/' + that.config.location + '.json';
    requestify.get(url, {
        dataType: 'json'
    }).then(function (response) {
        //grab the values
        var values = response.getBody();
        that.updateSensorValue(TEMPERATURE_ID, values.current_observation.temp_f);
        var hum = parseFloat(values.current_observation.relative_humidity) / 100;
        that.updateSensorValue(HUMIDITY_ID, hum);
        that.updateSensorValue(PRESSURE_ID, values.current_observation.pressure_in);
        that.updateSensorValue(PRECIPITATION_ID, values.current_observation.precip_1hr_in);
        that.updateSensorValue(WIND_SPEED_ID, values.current_observation.wind_mph);
        //set the current conditions
        var currentConditions = {
            location: values.current_observation.display_location.full,
            condition: values.current_observation.weather,
            condition_icon: 'wu-' + values.current_observation.icon,
            winds: values.current_observation.wind_string,
            wind_direction: values.current_observation.wind_dir,
            wind_speed: values.current_observation.wind_mph,
            wind_gusts: values.current_observation.wind_gust_mph,
            temperature: values.current_observation.temperature_string,
            humidity: values.current_observation.relative_humidity,
            pressure: values.current_observation.pressure_in,
            pressure_trend: values.current_observation.pressure_trend,
            dewpoint: values.current_observation.dewpoint_string,
            heat_index: values.current_observation.heat_index_string,
            wind_chill: values.current_observation.windchill_string,
            feels_like: values.current_observation.feelslike_string,
            visibility: values.current_observation.visibility_mi,
            precip: values.current_observation.precip_today_string,
            forecast_url: values.current_observation.forecast_url
        };
        that.updateSensorValue(CONDITIONS_ID, currentConditions);

    }).catch(function (err) {
        this.loggingService.error('Error Wunderground ' + this.id() + ': ' + err.message, err.stack);
    });
};
var WeatherPlugin = function() {
    SDK.Devices.DevicePlugin.call(this, 'Wunderground® - Current Weather');
    this.setUIModule('sprockets.plugin.weather', 'weatherUI.js');
    this.setUIConfigHTML('weatherConfig.html');
    this.addUIDependency('text/css', 'wu-icons-style.css');
    this.addWidget(new SDK.Devices.Widget('sprockets-weather',
        'Weather',
        'Display current weather in a location',
        'weatherWidget.html',
        'weatherCurrentCtrl'));
    this.addWidget(new SDK.Devices.Widget('sprockets-forecast',
        'Forecast',
        'Display weather forecast for a location',
        'forecastWidget.html',
        'weatherForecastCtrl'));
};

util.inherits(WeatherPlugin, SDK.Devices.DevicePlugin);

WeatherPlugin.prototype.createInstance = function(id, config, services) {
    return new WeatherInstance(id, config, services);
};

module.exports = new WeatherPlugin();