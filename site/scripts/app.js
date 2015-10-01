(function () {
  'use strict';

  var app = angular.module('guide', [
    'config', 'factory', 'search', 'profile', 'repository',
    'ngAnimate'
  ]).run(['$rootScope', function($rootScope) {
    $rootScope.github = $rootScope.profile = $rootScope.repo = {};
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
