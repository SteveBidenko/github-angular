/**
 * All the controllers
 *
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('Controllers', ['Github', 'ngMaterial', 'ngMessages'])
        .controller('MainController', MainController)
        .controller('GithubController', GithubController)
        .controller('ProfileController', ProfileController)
        .controller('UserInfoController', UserInfoController)
        .controller('RepositoryController', RepositoryController);

    MainController.$inject = ['$scope', '$mdSidenav', '$request', '$location', 'github'];
    /* @ngInject */
    function MainController($scope, $mdSidenav, $request, $location, github) {
        var $ctrl = this;

        $scope.canShowResults = false;
        $scope.recent = $request.recent();
        $scope.favorites = $request.favorites();
        $scope.github = github;
        $scope.selectedIndex = 1;

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        /**
         * Launch new search
         *
         * @param {String} request
         */
        $scope.newSearch = function (request) {
            if (request) {
                github.login = request;
                $scope.canShowResults = true;
                $location.path('/profile/' + request);
            }
        };

        console.log($scope, $ctrl);
    }

    UserInfoController.$inject = ['$request'];
    /* @ngInject */
    function UserInfoController($request) {
        var $ctrl = this;

        $ctrl.isFavorited = $request.isFavorite;

        $ctrl.switchFavorite = function (who) {
            if (who) {
                if ($request.isFavorite(who)) {
                    $request.rmFavorite(who);
                } else {
                    $request.toFavorite(who);
                }
            }
        };
        // console.log($ctrl);
    }

    GithubController.$inject = ['$scope', 'github'];
    /* @ngInject */
    function GithubController($scope, github) {
        var mv = this;
        mv.info = [];
        mv.readyToShowResults = github.readyToShowResults;
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

    ProfileController.$inject = ['$scope', 'github'];
    /* @ngInject */
    function ProfileController($scope, github) {
        var mv = this;
        mv.info = [];

        this.$routerOnActivate = function(next) {
            mv.login = next.params.id;
            mv.info = github.profile(next.params.id);
        };
        // console.log($scope, mv);
    }

    RepositoryController.$inject = ['$scope', 'github', '$log'];
    /* @ngInject */
    function RepositoryController($scope, github, $log) {
        var mv = this;
        mv.info = [];

        this.$routerOnActivate = function(next) {
            mv.info = github.profile(next.params.owner).repository(next.params.owner, next.params.id);
            // $log.log(next.params);
        };

        mv.title = function() {
            var owner = mv.info.detailProfile.login ? mv.info.detailProfile.login : mv.info.login;
            return owner + ' / ' + mv.info.detailRepository.name;
        };
        // console.log($scope, mv);
    }
})();
