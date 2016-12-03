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

        $ctrl.isFavorited = function (request) {
            return request ? $request.isFavorite(request) : false;
        };

        $ctrl.switchFavorite = function (request) {
            if (request) {
                if ($request.isFavorite(request)) {
                    $request.rmFavorite(request);
                } else {
                    $request.toFavorite(request);
                }
            }
            console.log('toFavorite', request);
        };

        $ctrl.back = function() {
            console.log('back is pressed');
            $location.path('/');
        };

        // console.log($scope, $ctrl);
    }

    GithubController.$inject = ['$scope', 'github'];
    /* @ngInject */
    function GithubController($scope, github) {
        var mv = this;
        mv.info = [];
        mv.readyToShowResults = github.readyToShowResults;
        $scope.backButtonShow = false;
        $scope.searchQuery = '';

        this.$routerOnActivate = function(next) {
            if (next.params.who) {
                // console.log('GithubController $routerOnActivate', next);
                $scope.searchQuery = next.params.who;
                mv.info = github.search(next.params.who, function() {
                    mv.readyToShowResults = github.readyToShowResults;
                });
            }
            // $scope.location = $location;
        };

        this.showNoResults = function() {
            // console.log(github.readyToShowResults, mv.info.users);
            return !(mv.readyToShowResults && mv.info.users && mv.info.users.length > 0);
        };
        // console.log($scope, mv);
    }

    ProfileController.$inject = ['github'];
    /* @ngInject */
    function ProfileController(github) {
        var mv = this;

        this.$routerOnActivate = function(next) {
            mv.login = next.params.id;
            mv.info = github.profile(next.params.id);
            console.log(next.params);
        };
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
