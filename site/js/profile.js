(function () {
  'use strict';

  var app = angular.module('profile', ['ngAnimate', 'ngRoute']);

  app.controller('ProfileController', [
    '$http', '$rootScope', '$routeParams', 
    function ($http, $rootScope, $routeParams) {
      var profile = this;
      var githubUrl = $rootScope.githubUrl + 'users/';
      profile.login = $routeParams.id;
      profile.repos = [];
      profile.isShow = false;
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
      }
      
      $rootScope.profile = profile;
      // console.log(typeof $rootScope.github.details)
  }]);
})();
