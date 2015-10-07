(function () {
  'use strict';

  var app = angular.module('controllers', []);

  app.controller('GithubController', [
    '$rootScope', '$routeParams', '$location', 'githubSearch',
    function ($rootScope, $routeParams, $location, githubSearch) {
      var github = this;

      $rootScope.location = $location;

      github.newSearch = function (request) {
        $rootScope.backButtonShow = true;
        $rootScope.location.path('/search/' + request);
      };

      if ($routeParams.who) {
        $rootScope.searchQuery = $routeParams.who;
        github.info = githubSearch.$get($routeParams.who);
      } else {
        $rootScope.backButtonShow = false;
        $rootScope.searchQuery = '';
      };
    }
  ]).controller('ProfileController', [
    '$rootScope', '$routeParams', 'githubSearch', 'githubProfile',
    function ($rootScope, $routeParams, githubSearch, githubProfile) {
      var profile = this;

      $rootScope.backButtonShow = githubSearch.isShow;
      profile.login = $routeParams.id;
      profile.info = githubProfile.$get($routeParams.id);
    }
  ]).controller('RepositoryController', [
    '$rootScope', '$routeParams', 'githubProfile', 'githubRepository',
    function ($rootScope, $routeParams, githubProfile, githubRepository) {
      var repo = this;

      repo.info = githubRepository.$get($routeParams.owner, $routeParams.id);
      $rootScope.backButtonShow = githubProfile.isShow;
      repo.owner = githubProfile.$get($routeParams.owner);
    }
  ]);
})();
