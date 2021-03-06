/**
 * The service github which gets full information about a coder, his repositories and commits
 *
 * @namespace Services
 */
(function () {
    'use strict';

    angular
        .module('Github', ['Resources'])
        .service('github', github)
        .provider('$request', request);

    function request() {
        const EXPIRED_TIME = 3600000;
        var recent = [], favorites = [], isStorage = typeof Storage !== 'undefined';
        return {
            init: function() {
                if (isStorage) {
                    if (localStorage.recent) {
                        recent = JSON.parse(localStorage.getItem('recent'));
                    }
                    if (localStorage.favorites) {
                        favorites = JSON.parse(localStorage.getItem('favorites'));
                    }
                }
                // console.info(recent, favorites, localStorage);
            },
            $get: ['gitResources', '$http', function(gitResources, $http) {
                return {
                    /**
                     * Get the recent array
                     *
                     * @return {Array}
                     */
                    recent: function() {
                        return recent;
                    },
                    recentUpdate: recentUpdate,
                    /**
                     * Get the favorites array
                     *
                     * @return {Array}
                     */
                    favorites: function() {
                        return favorites;
                    },
                    isFavorite: isFavorite,
                    /**
                     * Add the request to the favorites array
                     *
                     * @param {String} request
                     */
                    toFavorite: function(request) {
                        if (!isFavorite(request)) {
                            favorites.push(request);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                        }
                    },
                    /**
                     * Remove the request from the favorites array if it's exist there
                     *
                     * @param {String} request
                     */
                    rmFavorite: function(request) {
                        var idx = favorites.indexOf(request);
                        if (idx >= 0) {
                            favorites.splice(idx, 1);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                        }
                    },
                    /**
                     * Get data from the url
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    url: function (request, callback) {
                        $http.get(gitResources.following(request)).success(callback);
                    },
                    /**
                     * Get the user's subscriptions
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    following: function(request, callback) {
                        var timeStamp = Date.now(), key = 'subscriptions_' + request, fromStorage;
                        // Try to get from localStorage
                        if (isStorage && localStorage[key]) {
                            fromStorage = JSON.parse(localStorage.getItem(key));
                            // Check if data is expired. If non expired then call callback with the data.
                            if (timeStamp - fromStorage.timeStamp < EXPIRED_TIME) {
                                callback(fromStorage.data);
                                return;
                            } else {
                                localStorage.removeItem(key);
                            }
                        }
                        // Try to get from the server
                        $http.get(gitResources.following(request)).success(function (data) {
                            if (isStorage) {
                                localStorage.setItem(key, JSON.stringify({timeStamp: timeStamp, data: data}));
                            }
                            recentUpdate(request);
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
                        var timeStamp = Date.now(), key = 'info_' + request, fromStorage;
                        // Try to get from localStorage
                        if (isStorage && localStorage[key]) {
                            fromStorage = JSON.parse(localStorage.getItem(key));
                            // Check if data is expired. If non expired then call callback with the data.
                            if (timeStamp - fromStorage.timeStamp < EXPIRED_TIME) {
                                callback(fromStorage.data);
                                return;
                            } else {
                                localStorage.removeItem(key);
                            }
                        }
                        $http.get(gitResources.userInfo(request)).success(function(data) {
                            if (isStorage) {
                                localStorage.setItem(key, JSON.stringify({timeStamp: timeStamp, data: data}));
                            }
                            callback(data);
                        });
                    },
                    /**
                     * Get all the user's repositories
                     *
                     * @param {String} request
                     * @param {Function} callback
                     */
                    repositories: function(request, callback) {
                        var timeStamp = Date.now(), key = 'repositories_' + request, fromStorage;
                        // Try to get from localStorage
                        if (isStorage && localStorage[key]) {
                            fromStorage = JSON.parse(localStorage.getItem(key));
                            // Check if data is expired. If non expired then call callback with the data.
                            if (timeStamp - fromStorage.timeStamp < EXPIRED_TIME) {
                                callback(fromStorage.data);
                                return;
                            } else {
                                localStorage.removeItem(key);
                            }
                        }
                        $http.get(gitResources.repositories(request)).success(function(data) {
                            if (isStorage) {
                                localStorage.setItem(key, JSON.stringify({timeStamp: timeStamp, data: data}));
                            }
                            callback(data);
                        });
                    },
                    /**
                     * Get info of the user's repository with the name
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    repository: function(user, name, callback) {
                        $http.get(gitResources.repository(user, name)).success(callback);
                    },
                    /**
                     * Get all the branches of the user's repository
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    branches: function(user, name, callback) {
                        $http.get(gitResources.branches(user, name)).success(callback);
                    },
                    /**
                     * Get all the commits of the user's repository
                     *
                     * @param {String} user
                     * @param {String} name
                     * @param {Function} callback
                     */
                    commits: function(user, name, callback) {
                        $http.get(gitResources.commits(user, name)).success(callback);
                    },
                    /**
                     * Get user's activity (svg)
                     *
                     * @param {String} user
                     * @param {Function} callback
                     */
                    activity: function(user, callback) {
                        $http.post('/activity', {user: user}).success(callback);
                    }
                };
            }]
        };
        /**
         * Check if the request is in the favorites array
         *
         * @param {String} request
         * @return {boolean}
         */
        function isFavorite(request) {
            return request && favorites.indexOf(request) >= 0;
        }
        /**
         * Analyze and update the recent array
         *
         * @param {String} request
         */
        function recentUpdate(request) {
            var idx = recent.indexOf(request);
            if (idx >= 0) {
                recent.splice(idx, 1);
            }
            recent.unshift(request);
            localStorage.setItem('recent', JSON.stringify(recent));
        }
    }

    github.$inject = ['$request'];
    /* @ngInject */
    function github($request) {
        var self = this;
        cleanData();
        self.login = null;
        self.isShowRepository = false;
        self.isShowBranches = false;
        self.isShowCommits = false;
        self.isShowProfile = false;
        self.mode = 'profile';
        self.search = search;
        self.profile = profile;
        self.repository = repository;
        self.activity = activity;
        return self;
        /**
         * Initialize or clean all data
         */
        function cleanData() {
            self.detailProfile = {};
            self.repositories = [];
            self.users = [];
            self.repositoryName = '';
            self.detailRepository = {};
            self.branches = [];
            self.commits = [];
            self.readyToShowResults = false;
        }

        function search(request, callback) {
            checkPreviousState(request);
            self.login = request;
            // Check if the object detailProfile is empty
            if (Object.keys(self.detailProfile).length == 0) {
                profile(request);
            }
            // Do primary request
            $request.following(request, function (data) {
                self.users = data;
                // Wait for end of loading
                self.readyToShowResults = data.length == 0 ? true : self.readyToShowResults;
                // console.log(data);
                data.forEach(function (currentUser, idx) {
                    $request.userInfo(currentUser.login, function (info) {
                        self.users[idx].details = info;
                        // Wait for end of loading
                        self.readyToShowResults = idx == self.users.length - 1 ? true : self.readyToShowResults;
                    });
                });
                if (typeof callback === 'function') {
                    callback(self.users);
                }
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
            checkPreviousState(loginName);
            self.login = loginName;
            $request.userInfo(loginName, function (data) {
                $request.recentUpdate(loginName);
                self.detailProfile = data;
                self.readyToShowResults = Object.keys(data).length > 0 ? true : self.readyToShowResults;
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
        /**
         * Get full information for the repository
         *
         * @param {String} user
         * @param {String} name
         * @return {github}
         */
        function repository(user, name) {
            checkPreviousState(user);
            $request.recentUpdate(user);
            self.login = user;
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

        function activity(user, callback) {
            var isCallback = typeof callback === 'function';
            if (!user) {
                if (isCallback) {
                    callback(null);
                }
                return;
            }
            $request.activity(user, function(data) {
                if (isCallback) {
                    callback(data);
                }
            })
        }

        function checkPreviousState(login) {
            if (self.login != login) {
                cleanData();
            }
        }

    }
})();
