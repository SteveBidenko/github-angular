/**
 * The service github which gets full information about a coder, his repositories and commits
 *
 * @namespace Services
 */
(function () {
    'use strict';

    angular
        .module('Github', ['urls'])
        .service('github', github)

    github.$inject = ['githubResources', '$http'];
    /* @ngInject */
    function github(githubResources, $http) {
        var self = this;
        self.users = [];
        self.login = null;
        self.detailProfile = {};
        self.detailSearch = {};
        self.detailRepository = {};
        self.repos = [];
        self.owner = null;
        self.repositoryName = '';
        self.isShowRepository = false;
        self.branches = [];
        self.isShowBranches = false;
        self.commits = [];
        self.isShowCommits = false;
        self.isShowProfile = false;
        self.isShowSearch = false;
        self.search = search;
        self.profile = profile;
        self.repository = repository;
        return self;

        function search(request) {
            self.users = [];
            $http.get(githubResources.following(request)).success(function (data) {
                self.users = data;
                self.isShowSearch = data.length == 0 ? true : self.isShowSearch;
                data.forEach(function (currentUser, idx) {
                    $http.get(currentUser.url).success(function (data) {
                        self.users[idx].details = data;
                        self.detailSearch[data.login] = data;
                        self.isShowSearch = idx == self.users.length - 1 ? true : self.isShowSearch;
                    });
                });
            });
            return self;
        }
        /**
         * Get full profile of the user with all the repositories
         *
         * @param {String} loginName
         * @param {Function} [callback]
         * @returns {github}
         */
        function profile(loginName, callback) {
            self.login = loginName;
            $http.get(githubResources.userInfo(loginName)).success(function (data) {
                self.detailProfile = data;
                $http.get(githubResources.repos(loginName)).success(function (data) {
                    self.repos = data;
                    self.isShowProfile = true;
                    if (typeof callback === 'function') {
                        callback(self.repos);
                    }
                });
            });
            return self;
        }

        function repository(user, name) {
            self.owner = user;
            self.repositoryName = name;
            $http.get(githubResources.repository(user, name)).success(function (data) {
                self.detailRepository = data;
                self.isShowRepository = true;
            });
            $http.get(githubResources.branches(user, name)).success(function (data) {
                self.branches = data;
                self.isShowBranches = true;
            });
            $http.get(githubResources.commits(user, name)).success(function (data) {
                self.commits = data;
                self.isShowCommits = true;
            });
            return self;
        }
    }
})();
