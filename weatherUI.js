angular.module('sprockets.plugin.weather', ['ui.bootstrap']);

angular.module('sprockets.plugin.weather').controller('sprocketsWeatherPluginConfigController', function($scope, $sce, $http) {

    $scope.selectLocation = function(obj) {
        if (obj && obj.originalObject) {
            $scope.config.location = obj.originalObject.l;
            $scope.config.locationName = obj.originalObject.name;
        }
    };

    $scope.queryLocation = function(userInputString, timeoutPromise) {
        var url = "http://autocomplete.wunderground.com/aq";
        $sce.trustAsResourceUrl(url);
        return $http.jsonp(url, { params: { query: userInputString, cb: 'JSON_CALLBACK' }, jsonpCallbackParam: 'cb'}, {timeout: timeoutPromise});
    };
});

angular.module('sprockets.plugin.weather').controller('weatherCurrentCtrl', function($scope, deviceValues) {
    $scope.values = deviceValues;

});

angular.module('sprockets.plugin.weather').controller('weatherForecastCtrl', function($scope, deviceValues) {
    $scope.values = deviceValues;
});