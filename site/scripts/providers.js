(function () {
  'use strict';

  var app = angular.module('providers', ['urls']);

  app.service('githubSearch', [
    'githubResources', '$http',
    function (githubResources, $http) {
      return {
        users: [],
        details: {},
        isShow: false,
        $get: function (request) {
          var github = this;

          $http.get(githubResources.following(request)).success(function (data) {
            github.users = data;
            github.isShow = data.length == 0 ? true : github.isShow;
            data.forEach(function (currentUser, idx) {
              $http.get(currentUser.url).success(function (data) {
                github.users[idx].details = data;
                github.details[data.login] = data;
                github.isShow = idx == github.users.length - 1 ? true : github.isShow;
              });
            });
          });
          return this;
        }
      }
    }
  ]).service('githubProfile', [
    'githubResources', '$http',
    function (githubResources, $http) {
      return {
        login: null,
        details: {},
        repos: [],
        isShow: false,
        reposLoading: function (owner) {
          var profile = this;
          $http.get(githubResources.repos(owner)).success(function (data) {
            profile.repos = data;
            profile.isShow = true;
          });
          return this;
        },
        $get: function (login) {
          var profile = this;
          profile.login = login;
          $http.get(githubResources.userInfo(login)).success(function (data) {
            profile.details = data;
            profile.reposLoading(login);
          });
          return this;
        }
      };
    }
  ]).service('githubRepository', [
    'githubResources', '$http',
    function (githubResources, $http) {
      return {
        owner: null,
        name: null,
        details: {},
        isShowRepository:  false,
        banches: [],
        isShowBranches: false,
        commits: [],
        isShowCommits: false,
        getDetails: function (user, name) {
          var githubRepository = this;
          $http.get(githubResources.repository(user, name)).success(function (data) {
            githubRepository.details = data;
            githubRepository.isShowRepository = true;
          });
          return this;
        },
        getBranches: function (user, name) {
          var githubRepository = this;
          $http.get(githubResources.branches(user, name)).success(function (data) {
            githubRepository.branches = data;
            githubRepository.isShowBranches = true;
          });
          return this;
        },
        getCommits: function (user, name) {
          var githubRepository = this;
          $http.get(githubResources.commits(user, name)).success(function (data) {
            githubRepository.commits = data;
            githubRepository.isShowCommits = true;
          });
          return this;
        },
        $get: function (user, name) {
          this.owner = user;
          this.name = name;
          this.getDetails(user, name).getBranches(user, name).getCommits(user, name);
          return this;
        }
      };
    }
  ]);
})();

