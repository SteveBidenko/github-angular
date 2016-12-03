/**
 * Get github resources
 *
 * @namespace factories
 */
(function () {
    'use strict';

    angular
        .module('Resources', [])
        .constant('githubSite', {
            url: 'https://api.github.com/'
        })
        .factory('gitResources', gitResources);

    gitResources.$inject = ['githubSite'];
    /* @ngInject */
    function gitResources(githubSite) {
        var users = githubSite.url + 'users/';
        // return the factory
        return {
            users: users,
            userInfo: userInfo,
            following: following,
            repositories: repositories,
            repository: repository,
            branches: branches,
            commits: commits
        };
        /**
         * Get user info url
         *
         * @param {String} user
         * @returns {string}
         */
        function userInfo(user) {
            return users + user;
        }
        /**
         * Get user followers' url
         *
         * @param {String} user
         * @returns {string}
         */
        function following(user) {
            return userInfo(user) + '/following';
        }
        /**
         * Get user repositories' url
         *
         * @param {String} user
         * @returns {string}
         */
        function repositories(user) {
            return userInfo(user) + '/repos';
        }
        /**
         * Get user repository url
         *
         * @param {String} user
         * @param {String} name
         * @returns {string}
         */
        function repository(user, name) {
            return githubSite.url + 'repos/' + user + '/' + name;
        }
        /**
         * Get branches' url of the user repository
         *
         * @param {String} user
         * @param {String} name
         * @returns {string}
         */
        function branches(user, name) {
            return repository(user, name) + '/branches';
        }
        /**
         * Get commits' url of the user repository
         *
         * @param {String} user
         * @param {String} name
         * @returns {string}
         */
        function commits(user, name) {
            return repository(user, name) + '/commits';
        }
    }
})();
