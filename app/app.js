/**
 * Primary module
 *
 * @namespace Application
 */
(function () {
    'use strict';

    angular
        .module('app', ['ngComponentRouter', 'ngMaterial', 'Github', 'Controllers', 'ngAnimate'])
        .value('$routerRootComponent', 'app')
        .config(config)
        .run(run)
        .component('app', {
            templateUrl: '/views/app.html',
            controller: 'MainController',
            $routeConfig: [
                {path: '/following/...', name: 'Subscriptions', component: 'subscriptions'},
                {path: '/profile/...', name: 'Profiles', component: 'profiles'},
                {path: '/repository/...', name: 'Repositories', component: 'repositories'}
            ]
        })
        .component('subscriptions', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'EmptyParam', component: 'emptyParam', useAsDefault: true},
                {path: '/:who', name: 'SubList', component: 'subList'}
            ]
        })
        .component('profiles', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'EmptyParam', component: 'emptyParam', useAsDefault: true},
                {path: '/:id', name: 'Profile', component: 'profile'}
            ]
        })
        .component('repositories', {
            template: '<ng-outlet></ng-outlet>',
            $routeConfig: [
                {path: '/', name: 'EmptyParam', component: 'emptyParam', useAsDefault: true},
                {path: '/:owner/:id', name: 'Repository', component: 'repository'}
            ]
        })
        .component('emptyParam', {
            template: '<md-subheader>Empty params!</md-subheader>'
        })
        .component('subList', {
            templateUrl: '/views/subList.html',
            bindings: {
                $router: '<'
            },
            controller: 'GithubController'
        })
        .component('profile', {
            templateUrl: '/views/profile.html',
            bindings: {
                $router: '<'
            },
            controller: 'ProfileController'
        })
        .component('repository', {
            templateUrl: '/views/repository.html',
            bindings: {
                $router: '<'
            },
            controller: 'RepositoryController'
        })
        .component('leftList', {
            templateUrl: '/views/leftList.html',
            bindings: {type: '<'},
            controller: ['$attrs', function ($attrs) {
                this.name = $attrs.name;
                this.class = $attrs.type;
            }]
        })
        .component('userInfo', {
            templateUrl: '/views/userInfo.html',
            controller: 'UserInfoController',
            bindings: {profile: '<'}
        })
        .component('userActivity', {
            template: '<div class="activity" ng-bind-html="$ctrl.svg"></div>',
            bindings: {login: '<'},
            controller: ['$scope', '$sce', '$request', function($scope, $sce, $request) {
                var ua = this;
                ua.svg = '';
                $scope.$watch('ua.login', function () {
                    if (ua.login) {
                        $request.activity(ua.login, function(data) {
                            ua.svg = $sce.trustAsHtml(data);
                        });
                    }
                });
            }]
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
            .primaryPalette('green');
        $requestProvider.init();
    }
})();
