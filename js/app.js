// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngGeolocation', 'ngResource', 'ngGeolocation']);




// ROUTES
weatherApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })

        .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

        .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

});

// SERVICES


weatherApp.service('cityService', function() {

    this.city = "Cleveland, OH";


});

// CONTROLLERS


weatherApp.controller('geolocCtrl', ['$geolocation', '$scope', function($geolocation, $scope) {
    $geolocation.getCurrentPosition({
        timeout: 60000
    }).then(function(position) {
        console.log(position);
        $scope.myPosition = position;
    });
}]);


weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {

    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });

}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

    $scope.city = cityService.city;

    $scope.days = $routeParams.days || '2';

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=6e1eb9f86b95b66e1f503a72c7bdab0c", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});

    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });

    console.log($scope.weatherResult);

    $scope.convertToFahrenheit = function(degK) {

        return Math.round((1.8 * (degK - 273)) + 32);

    }

    $scope.convertToDate = function(dt) {

        return new Date(dt * 1000);

    };

}]);

// directive
/*
weatherApp.directive("weatherReport", function() {
    return {
        restrict: 'E',
        template: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: "=",
            convertToStandard: "&",
            convertToDate: "&",
            dateFormat: "@"
        }
    }
});


// http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=YOURAPIKEY
*/
