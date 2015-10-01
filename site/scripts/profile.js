(function () {
  'use strict';

  var app = angular.module('profile', []);

  app.controller('ProfileController', [
    '$http', '$rootScope', '$routeParams', 'githubResources',
    function ($http, $rootScope, $routeParams, githubResources) {
      var profile = this;
      profile.login = $routeParams.id;
      profile.repos = [];
      profile.reposLoading = function (owner) {
        $http.get(githubResources.repos(owner)).success(function (data) {
          profile.repos = data;
          profile.isShow = true;
        });
      }

      if (typeof $rootScope.github.details === 'undefined') {
        profile.details = {};
        $http.get(githubResources.userInfo(profile.login)).success(function (data) {
          profile.details = data;
          profile.reposLoading(profile.login);
        });
      } else {
        profile.details = $rootScope.github.details[$routeParams.id];
        profile.reposLoading(profile.login);
        $rootScope.backButtonShow = true;
      }

      $rootScope.profile = profile;
  }]);
})();
