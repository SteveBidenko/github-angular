/**
 * Primary module
 *
 * @namespace main
 */
(function () {
    'use strict';

    angular
        .module('app', ['ngComponentRouter', 'ngMaterial', 'Github', 'controllers', 'ngAnimate'])
        .constant('githubSite', {
            url: 'https://api.github.com/'
        })
        .value('$routerRootComponent', 'app')
        .config(router)
        .run(run)
        .component('app', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/search/:who', name: 'Followers', component: 'followers'},
                {path: '/profile/:id', name: 'Profile', component: 'profile'},
                {path: '/repo/:owner/:id', name: 'Repositories', component: 'repositories'}
            ]
        })
        .component('startPage', {
            templateUrl: 'views/nav.html',
            controller: 'SearchController as sc',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/:who', name: 'Followers', component: 'followers'}
            ]
        })
        .component('followers', {
            templateUrl: 'views/home.html',
            bindings: { $router: '<' },
            controller: 'GithubController as github'
        })
        .component('profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController as profile',
            $routeConfig: [
                {path: '/', name: 'StartPage', component: 'startPage', useAsDefault: true},
                {path: '/:who', name: 'Followers', component: 'followers'}
            ]
        })
        .component('repositories', {
            templateUrl: 'views/repository.html',
            controller: 'RepositoryController as repository'
        });

    run.$inject = ['$rootScope', '$window'];
    /* @ngInject */
    /**
     * This applications starts from this function
     *
     * @param {Object} $rootScope
     * @param {Object} $window
     */
    function run($rootScope, $window) {
        console.log('Called run', $rootScope, $window);
        // $rootScope.back = function () {
        //     $window.history.back();
        // };
    }
    router.$inject = ['$locationProvider', '$mdThemingProvider'];
    /* @ngInject */
    /**
     * Set component routing
     *
     * @param {Object} $locationProvider
     * @param {Object} $mdThemingProvider
     */
    function router($locationProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);
        // Set theme
        $mdThemingProvider.theme('default')
            .primaryPalette('blue');
    }
})();
