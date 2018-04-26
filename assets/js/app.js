myApp = angular.module('rekonnect',['ui.router', 'ngResource']);

myApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'assets/partials/login.html',
            controller: 'LoginController'
        })
        .state('secure', {
            url: '/secure',
            templateUrl: 'assets/partials/secure.html',
            controller: 'SecureController'
        });
    $urlRouterProvider.otherwise('/login');
});

myApp.controller("LoginController", function($scope, api) {
    var client_id="be1ddfd07e25e93";
    var redirect_uri="http://localhost:8000/oauth_callback.html";
    var response_type="token";
    $scope.login = function() {
      window.location.href= "https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type="+response_type;
    }
    
    return api.get_viral_photos().$promise.then(function onSuccess(data) {
      // access data from 'response'
      $scope.viral_photos = data.data;
    },
    function onFail(data) {
    // handle failure
    });
});

myApp.controller("SecureController", function($scope, api) {

    $scope.accessToken = JSON.parse(window.localStorage.getItem("imgur")).oauth.access_token;
    $scope.username = JSON.parse(window.localStorage.getItem("imgur")).oauth.account_username;
    return api.get_photos().$promise.then(function onSuccess(data) {
      // access data from 'response'
      $scope.photos = data.data;
    },
    function onFail(data) {
    // handle failure
    });
});

myApp.factory('api',function($resource) {
    var client_id="be1ddfd07e25e93";
    
    accessToken = JSON.parse(window.localStorage.getItem("imgur")).oauth.access_token;
    username = JSON.parse(window.localStorage.getItem("imgur")).oauth.account_username;
    var photos = $resource('https://api.imgur.com/3/account/'+ username +'/images/', {}, {
            get: {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            }
    });
    
    var viral_photos = $resource('https://api.imgur.com/3/gallery/hot/viral/0.json/?client_id=' + client_id);
    
    return {
       get_photos: function(success, error){
          return photos.get();
        },
       get_viral_photos: function(success, error) {
           return viral_photos.get();
       }
  };
});