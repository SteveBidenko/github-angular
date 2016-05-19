/**
 * Primary module
 *
 * @namespace main
 */
(function () {
    'use strict';

    angular
        .module('guide', ['config', 'Providers', 'controllers', 'ngAnimate'])
        .run(run)
        .directive('backButton', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/back-button.html'
            };
        });

    run.$inject = ['$rootScope', '$window'];
    /* @ngInject */
    function run($rootScope, $window) {
        $rootScope.back = function () {
            $window.history.back();
        };
    }
})();
