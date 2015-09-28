(function () {
  'use strict';

  // var app = angular.module('guide', ['following']);
  var app = angular.module('guide', [
    'profile', 'repository', 'ngAnimate', 'ngRoute'
  ]).config([
    '$routeProvider', 
    function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'GithubController as github'
      });
      $routeProvider.when('/profile/:id', {
        templateUrl: 'profile.html',
        controller: 'ProfileController as profile'
      });
      $routeProvider.when('/repo/:owner/:id', {
        templateUrl: 'repository.html',
        controller: 'RepositoryController as repo'
      });
    }
  ]).run(['$rootScope', function($rootScope) {
    $rootScope.githubUrl = 'https://api.github.com/';
    $rootScope.github = {};
    $rootScope.profile = {};
    $rootScope.repo = {};
  }]);

  app.controller('GithubController', [
    '$http', '$rootScope', 
    function ($http, $rootScope) {
      var github = this;

      github.isShow = false;
      github.launchSearch = function () {
        // console.log(github.search.who);
        var githubSource = $rootScope.githubUrl + 'users/' + github.search.who + '/following';
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
      }

      $rootScope.github = github;
    }
  ]);
})();
