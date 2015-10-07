(function () {
  'use strict';

  var app = angular.module('guide', [
    'config', 'providers', 'controllers',
    'ngAnimate'
  ]).run(['$rootScope', function($rootScope) {
    $rootScope.back = function () {
      window.history.back();
    };
  }]).directive('backButton', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/back-button.html',
    };
  });

})();
