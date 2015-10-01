(function () {
  'use strict';

  var app = angular.module('search', []);

  app.controller('GithubController', [
    '$http', '$rootScope', '$location', '$routeParams', 'githubResources',
    function ($http, $rootScope, $location, $routeParams, githubResources) {
      var github = this;
      $rootScope.location = $location;

      github.newSearch = function (request) {
        $rootScope.backButtonShow = true;
        $rootScope.location.path('/search/' + request);
      };

      github.launchSearch = function (request) {
        var githubSource = githubResources.following(request);
        github.users = [];
        github.details = {};

        $http.get(githubSource).success(function (data) {
          github.users = data;
          data.forEach(function (currentUser, idx) {
            $http.get(currentUser.url).success(function (data) {
              github.users[idx].details = data;
              github.details[data.login] = data;
            });
          });
          github.isShow = true;
        });
      };

      if ($routeParams.who) {
        $rootScope.searchQuery = $routeParams.who;
        github.launchSearch($routeParams.who);
      } else {
        $rootScope.backButtonShow = false;
        $rootScope.searchQuery = '';
      }
      $rootScope.github = github;
    }
  ]);
})();
