(function () {
  'use strict';

  var app = angular.module('profile', []);

  app.controller('ProfileController', [
    '$http', '$rootScope', '$routeParams', 
    function ($http, $rootScope, $routeParams) {
      var profile = this;
      var githubUrl = $rootScope.githubUrl + 'users/';
      profile.login = $routeParams.id;
      profile.repos = [];
      profile.reposLoading = function (owner) {
        var githubSource = githubUrl + owner + '/repos';
        $http.get(githubSource).success(function (data) {
          profile.repos = data;
          profile.isShow = true;
        });
      }

      if (typeof $rootScope.github.details === 'undefined') {
        profile.details = {};
        $http.get(githubUrl + profile.login).success(function (data) {
          profile.details = data;
          profile.reposLoading(profile.login);
        });
      } else {
        profile.details = $rootScope.github.details[$routeParams.id];
        profile.reposLoading(profile.login);
        $rootScope.back = function () {
          window.history.back();
          delete $rootScope.back;
        };
      }
      
      $rootScope.profile = profile;
  }]);
})();
