/**
 * All the controllers
 *
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('Controllers', ['Github', 'ngMaterial', 'ngMessages'])
        .controller('SearchController', SearchController)
        .controller('GithubController', GithubController)
        .controller('ProfileController', ProfileController)
        .controller('RepositoryController', RepositoryController);

    SearchController.$inject = ['$scope', '$request', '$location'];
    /* @ngInject */
    function SearchController($scope, $request, $location) {
        var $ctrl = this;

        $ctrl.subscription = '';
        $ctrl.isShowResults = false;
        $ctrl.backButtonShow = false;
        $scope.recent = $request.recent();
        $scope.favorites = $request.favorites();

        $ctrl.newSearch = function (request) {
            $ctrl.subscription = request;
            $ctrl.backButtonShow = true;
            $ctrl.isShowResults = true;
            $location.path('/search/' + request);
        };

        $ctrl.back = function() {
            console.log('back is pressed');
            $location.path('/');
        };

        $ctrl.$routerOnActivate = function(next) {
            console.log('SearchController $routerOnActivate', next);
        };

        $scope.clickList = function(event) {
            console.log(event);
        };
        console.log($scope, $ctrl);
    }

    GithubController.$inject = ['$rootScope', '$location', 'github'];
    /* @ngInject */
    function GithubController($rootScope, $location, github) {
        var mv = this;
        mv.info = [];
        github.isShowSearch = false;

        this.$routerOnActivate = function(next) {
            console.log('GithubController $routerOnActivate', next);
            if (next.params.who) {
                $rootScope.searchQuery = next.params.who;
                mv.info = github.search(next.params.who);
                $rootScope.isShowResults = true;
            } else {
                $rootScope.backButtonShow = false;
                $rootScope.searchQuery = '';
                $rootScope.isShowResults = false;
            }
            $rootScope.location = $location;
        };

    }

    ProfileController.$inject = ['$rootScope', '$routeParams', 'github'];
    /* @ngInject */
    function ProfileController($rootScope, $routeParams, github) {
        var mv = this;

        $rootScope.backButtonShow = github.isShowSearch;
        mv.login = $routeParams.id;
        mv.info = github.profile($routeParams.id);
    }

    RepositoryController.$inject = ['$rootScope', '$routeParams', 'github', '$log'];
    /* @ngInject */
    function RepositoryController($rootScope, $routeParams, github) {
        var mv = this;

        mv.info = github.repository($routeParams.owner, $routeParams.id);
        $rootScope.backButtonShow = github.isShowProfile;
        mv.owner = github.profile($routeParams.owner);
        mv.title = function() {
            var owner = mv.owner.detailProfile.login ? mv.owner.detailProfile.login : mv.info.owner;
            return owner + ' / ' + mv.info.detailRepository.name;
        };
    }
})();
