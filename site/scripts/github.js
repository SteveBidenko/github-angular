(function () {
  'use strict';

  var app = angular.module('factory', []);

  app.factory('githubResources', ['githubSite', function (githubSite) {
    return {
      users: githubSite.url + 'users/',
      userInfo: function (user) {
        return this.users + user;
      },
      following: function (user) {
        return this.userInfo(user) + '/following';
      },
      repos: function (user) {
        return this.userInfo(user) + '/repos';
      },
      repository: function (user, name) {
        return githubSite.url + 'repos/' + user + '/' + name;
      }, 
      branches: function (user, name) {
        return this.repository(user, name) + '/branches';
      },
      commits: function (user, name) {
        return this.repository(user, name) + '/commits';
      }
    }
  }]);
})();
