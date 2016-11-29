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
        .provider('$request', request);

    function request() {
        const EXPIRED_TIME = 3600000;
        var recent = [], isStorage = typeof Storage !== 'undefined';
        return {
            init: function() {
                if (isStorage && localStorage.recent) {
                    recent = JSON.parse(localStorage.getItem('recent'));
                }
                console.info(recent, localStorage);
            },
            $get: ['githubResources', '$http', function(githubResources, $http) {
                return {
                    /**
                     * Get data from the url
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    url: function (request, callback) {
                        $http.get(githubResources.following(request)).success(callback);
                    },
                    /**
                     * Get the user's subscriptions
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    following: function(request, callback) {
                        var timeStamp = Date.now(), idx = recent.indexOf(request),
                            isRecently = idx >= 0,
                            key = 'user_' + request, fromStorage;
                        // Try to get from localStorage
                        if (isRecently && isStorage && localStorage[key]) {
                            fromStorage = JSON.parse(localStorage.getItem(key));
                            // Data is
                            if (timeStamp - fromStorage.timeStamp < EXPIRED_TIME) {
                                callback(fromStorage.data);
                                return;
                            } else {
                                localStorage.removeItem(key);
                                recent.splice(idx, 1);
                                localStorage.setItem('recent', JSON.stringify(recent));
                            }
                        }
                        // Try to get from the server
                        $http.get(githubResources.following(request)).success(function (data) {
                            if (isStorage) {
                                localStorage.setItem(key, JSON.stringify({timeStamp: timeStamp, data: data}));
                                recent.push(request);
                                localStorage.setItem('recent', JSON.stringify(recent));
                            }
                            callback(data);
                        });

                    },
                    /**
                     * Get the user info
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    userInfo: function(request, callback) {
                        $http.get(githubResources.repositories(request)).success(callback);
                    },
                    /**
                     * Get all the user's repositories
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    repositories: function(request, callback) {
                        $http.get(githubResources.repositories(request)).success(callback);
                    },
                    /**
                     * Get info of the user's repository with the name
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    repository: function(user, name, callback) {
                        $http.get(githubResources.repository(user, name)).success(callback);
                    },
                    /**
                     * Get all the branches of the user's repository
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    branches: function(user, name, callback) {
                        $http.get(githubResources.branches(user, name)).success(callback);
                    },
                    /**
                     * Get all the commits of the user's repository
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    commits: function(user, name, callback) {

                    }
                };
            }]
        };
    }

    github.$inject = ['$request'];
    /* @ngInject */
    function github($request) {
        var self = this;
        self.users = [];
        self.login = null;
        self.detailProfile = {};
        self.detailSearch = {};
        self.detailRepository = {};
        self.repositories = [];
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
            $request.following(request, function (data) {
                self.users = data;
                self.isShowSearch = data.length == 0 ? true : self.isShowSearch;
                console.log(data);
                // data.forEach(function (currentUser, idx) {
                //     $request.url(currentUser.url, function (info) {
                //         self.users[idx].details = info;
                //         self.detailSearch[info.login] = info;
                //         self.isShowSearch = idx == self.users.length - 1 ? true : self.isShowSearch;
                //     });
                // });
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
            $request.userInfo(loginName, function (data) {
                self.detailProfile = data;
                $request.repositories(loginName, function (data) {
                    self.repositories = data;
                    self.isShowProfile = true;
                    if (typeof callback === 'function') {
                        callback(self.repositories);
                    }
                });
            });
            return self;
        }

        function repository(user, name) {
            self.owner = user;
            self.repositoryName = name;
            $request.repository(user, name, function (data) {
                self.detailRepository = data;
                self.isShowRepository = true;
            });
            $request.branches(user, name, function (data) {
                self.branches = data;
                self.isShowBranches = true;
            });
            $request.commits(user, name, function (data) {
                self.commits = data;
                self.isShowCommits = true;
            });
            return self;
        }
    }
})();