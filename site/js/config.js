(function () {
  'use strict';

  var app = angular.module('config', ['ngRoute']).constant('githubSite', {
    url: 'https://api.github.com/'
  }).config([
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
  ]);
})();
