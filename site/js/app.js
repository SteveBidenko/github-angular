(function () {
  'use strict';

  var app = angular.module('guide', [
    'profile', 'repository', 'ngAnimate', 'ngRoute'
  ]).config([
    '$routeProvider',
    function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'GithubController as github'
      }).when('/search/:who', {
        templateUrl: 'home.html',
        controller: 'GithubController as github'
      }).when('/profile/:id', {
        templateUrl: 'profile.html',
        controller: 'ProfileController as profile'
      }).when('/repo/:owner/:id', {
        templateUrl: 'repository.html',
        controller: 'RepositoryController as repo'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]).run(['$rootScope', function($rootScope) {
    $rootScope.githubUrl = 'https://api.github.com/';
    $rootScope.github = $rootScope.profile = $rootScope.repo = {};
    $rootScope.back = function () {
      window.history.back();
    };
  }]).directive('backButton', function () {
    return {
      restrict: 'E',
      templateUrl: 'back-button.html',
    };
  });

  app.controller('GithubController', [
    '$http', '$rootScope', '$location', '$routeParams',
    function ($http, $rootScope, $location, $routeParams) {
      var github = this;
      $rootScope.location = $location;

      github.newSearch = function (request) {
        $rootScope.backButtonShow = true;
        $rootScope.location.path('/search/' + request);
      }
      github.launchSearch = function (request) {
        var githubSource = $rootScope.githubUrl + 'users/' + request + '/following';
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
