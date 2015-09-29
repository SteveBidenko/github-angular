(function () {
  'use strict';

  var app = angular.module('repository', []);

  app.controller('RepositoryController', [
    '$http', '$rootScope', '$routeParams',
    function ($http, $rootScope, $routeParams) {
      var repo = this;
      repo.name = $routeParams.id;
      repo.owner = $routeParams.owner;
      var githubUrl = $rootScope.githubUrl + 'repos/' + repo.owner + '/' + repo.name;
      repo.ownerInfo = {};
      repo.branches = repo.commits = [];

      if (typeof $rootScope.profile.details === 'undefined') {
        var githubSource = $rootScope.githubUrl + 'users/' + repo.owner;
        $http.get(githubSource).success(function (data) {
          repo.ownerInfo = data;
        });
      } else {
        repo.ownerInfo = $rootScope.profile.details;
        $rootScope.backButtonShow = true;
      }

      $http.get(githubUrl).success(function (data) {
        repo.details = data;
        repo.isShow = true;
      });

      $http.get(githubUrl + '/branches').success(function (data) {
        repo.branches = data;
        repo.isShowBranches = true;
      });

      $http.get(githubUrl + '/commits').success(function (data) {
        repo.commits = data;
        repo.isShowCommits = true;
      });

      $rootScope.repo = repo;
  }]);
})();
