/**
 * Primary module
 *
 * @namespace main
 */
(function () {
    'use strict';

    angular
        .module('guide', ['config', 'Github', 'controllers', 'ngAnimate'])
        .run(run);

    run.$inject = ['$rootScope', '$window'];
    /* @ngInject */
    /**
     * This applications starts from this function
     *
     * @param {Object} $rootScope
     * @param {Object} $window
     */
    function run($rootScope, $window) {
        $rootScope.back = function () {
            $window.history.back();
        };
    }
})();
