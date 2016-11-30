/**
 * Primary module
 *
 * @namespace main
 */
(function () {
    'use strict';

    angular
        .module('app', ['ngComponentRouter', 'ngMaterial', 'Github', 'Controllers', 'ngAnimate'])
        .value('$routerRootComponent', 'app')
        .config(config)
        .run(run)
        .component('app', {
            templateUrl: '/app/views/app.html',
            controller: 'SearchController as $ctrl',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/search/...', name: 'Subscriptions', component: 'subscriptions'},
                {path: '/profile/....', name: 'Profile', component: 'profile'}
            ]
        })
        .component('startPage', {
            templateUrl: '/app/views/nav.html',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/:who', name: 'Subscriptions', component: 'subscriptions'}
            ]
        })
        .component('subscriptions', {
            templateUrl: '/app/views/subscriptions.html',
            bindings: { $router: '<' },
            controller: 'GithubController as github',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/:who', name: 'Subscriptions', component: 'subscriptions'}
            ]
        })
        .component('profile', {
            templateUrl: '/app/views/profile.html',
            controller: 'ProfileController as profile',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/:who', name: 'Followers', component: 'followers'}
            ]
        })
        .component('repositories', {
            templateUrl: '/app/views/repository.html',
            controller: 'RepositoryController as repository',
            $routeConfig: [
                {path: '/repo/:owner/:id', name: 'Repositories', component: 'repositories'}
            ]
        });

    run.$inject = ['$window'];
    /* @ngInject */
    /**
     * This applications starts from this function
     *
     * @param {Object} $window
     */
    function run($window) {
        console.log('Called run', $window);
    }
    config.$inject = ['$locationProvider', '$mdThemingProvider', '$requestProvider'];
    /* @ngInject */
    /**
     * Setup the app configuration (component routing, theme, etc.)
     *
     * @param {Object} $locationProvider
     * @param {Object} $mdThemingProvider
     * @param {Object} $requestProvider
     */
    function config($locationProvider, $mdThemingProvider, $requestProvider) {
        $locationProvider.html5Mode(true);
        // Set theme
        $mdThemingProvider.theme('default')
            .primaryPalette('blue');
        $requestProvider.init();
    }
})();
