(function () {
  'use strict';

  var app = angular.module('repository', []);

  app.controller('RepositoryController', [
    '$http', '$rootScope', '$routeParams', 'githubResources',
    function ($http, $rootScope, $routeParams, githubResources) {
      var repo = this,
        owner = $routeParams.owner,
        name = $routeParams.id;
      repo.ownerInfo = {};
      repo.branches = repo.commits = [];

      if (typeof $rootScope.profile.details === 'undefined') {
        $http.get(githubResources.userInfo(owner)).success(function (data) {
          repo.ownerInfo = data;
        });
      } else {
        repo.ownerInfo = $rootScope.profile.details;
        $rootScope.backButtonShow = true;
      }

      $http.get(githubResources.repository(owner, name)).success(function (data) {
        repo.details = data;
        repo.isShow = true;
      });

      $http.get(githubResources.branches(owner, name)).success(function (data) {
        repo.branches = data;
        repo.isShowBranches = true;
      });

      $http.get(githubResources.commits(owner, name)).success(function (data) {
        repo.commits = data;
        repo.isShowCommits = true;
      });

      $rootScope.repo = repo;
  }]);
})();
