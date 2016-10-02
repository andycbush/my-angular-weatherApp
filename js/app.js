// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource', 'ngGeolocation']);


var theLat = "";
var theLon = "";

// ROUTES
weatherApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })

        .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'cityForecastController'
    })

        .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'cityForecastController'
    })

        .when('/geoforecast', {
        templateUrl: 'pages/geoforecast.htm',
        controller: 'geoForecastController'
    })

});

// SERVICES


weatherApp.service('cityService', function() {
    this.city = "Cleveland, OH";
});


// CONTROLLERS


weatherApp.controller('geoController', function($scope, $geolocation){

    $scope.$geolocation = $geolocation;
    //console.log($scope.$geolocation);
    // basic usage
    $geolocation.getCurrentPosition().then(function(location) {
        $scope.location = location;
        //console.log($scope.location);//returns an object
        theLat = location.coords.latitude;
        theLon = location.coords.longitude;
        //console.log($scope.myLat);//returns current latitude
    });


    // regular updates
    $geolocation.watchPosition({
        timeout: 60000,
        maximumAge: 2,
        enableHighAccuracy: true
    });
    $scope.coords = $geolocation.position.coords; // this is regularly updated
    $scope.error = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs

});

weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {

    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });

}]);

weatherApp.controller('cityForecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

    if((theLat != "") && (theLon != "")) {

        $scope.city = cityService.city;

        $scope.days = $routeParams.days || '2';

        $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=6e1eb9f86b95b66e1f503a72c7bdab0c", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});

        $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days});

        $scope.convertToFahrenheit = function(degK) {
            return Math.round((1.8 * (degK - 273)) + 32);
        }

        $scope.convertToDate = function(dt) {

            return new Date(dt * 1000);

        }
    }
    else {
        window.location = "/index.html#/";
    }

}]);


weatherApp.controller('geoForecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {
    if((theLat != "") && (theLon != "")) {
        $scope.city = cityService.city;

        $scope.days = $routeParams.days || '2';

        $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=6e1eb9f86b95b66e1f503a72c7bdab0c", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});

        $scope.weatherResult = $scope.weatherAPI.get({ lat: theLat.toString(), lon: theLon.toString(), cnt: $scope.days });

        $scope.convertToFahrenheit = function(degK) {
            return Math.round((1.8 * (degK - 273)) + 32);
        }

        $scope.convertToDate = function(dt) {
            return new Date(dt * 1000);
        }
    }
    else {
        window.location = "/index.html#/";
    }

}]);



// http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=YOURAPIKEY

