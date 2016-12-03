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
                {path: '/following/...', name: 'Subscriptions', component: 'subscriptions'},
                {path: '/profile/....', name: 'Profile', component: 'profile'},
                {path: '/repo/....', name: 'Repositories', component: 'repositories'}
            ]
        })
        .component('subscriptions', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'EmptyParam', component: 'emptyParam', useAsDefault: true},
                {path: '/:who', name: 'SubList', component: 'subList'}
            ]
        })
        .component('profile', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'EmptyParam', component: 'emptyParam', useAsDefault: true},
                {path: '/:who', name: 'Detail', component: 'detail'}
            ]
        })
        .component('emptyParam', {
            template: '<md-subheader>Empty params!</md-subheader>'
        })
        .component('subList', {
            templateUrl: '/app/views/subList.html',
            bindings: { $router: '<' },
            controller: 'GithubController as github'
        })
        .component('detail', {
            templateUrl: '/app/views/profile.html',
            bindings: { $router: '<' },
            controller: 'ProfileController as profile'
        })
        .component('repositories', {
            templateUrl: '/app/views/repository.html',
            controller: 'RepositoryController as repository'
            // $routeConfig: [
            //     {path: '/repo/:owner/:id', name: 'Repositories', component: 'repositories'}
            // ]
        }).component('leftList', {
            templateUrl: '/app/views/leftList.html',
            bindings: {type: '<'},
            controller: function ($scope, $element, $attrs) {
                this.name = $attrs.name;
                this.class = $attrs.type;
            }
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
