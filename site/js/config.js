/**
 * Set routing
 *
 * @namespace apps
 */
(function () {
    'use strict';

    angular
        .module('config', ['ngRoute', 'ngMaterial'])
        .constant('githubSite', {
            url: 'https://api.github.com/'
        })
        .config(primaryRoute);

    primaryRoute.$inject = ['$routeProvider', '$mdThemingProvider'];
    /* @ngInject */
    function primaryRoute($routeProvider, $mdThemingProvider) {
        // Set routing
        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'GithubController as github'
        }).when('/search/:who', {
            templateUrl: 'views/home.html',
            controller: 'GithubController as github'
        }).when('/profile/:id', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController as profile'
        }).when('/repo/:owner/:id', {
            templateUrl: 'views/repository.html',
            controller: 'RepositoryController as repo'
        }).otherwise({
            redirectTo: '/'
        });
        // Set theme
        $mdThemingProvider.theme('default')
            .primaryPalette('cyan');
    }
})();
