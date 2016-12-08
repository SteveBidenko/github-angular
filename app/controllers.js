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
        .controller('ProfileController', ProfileController)
        .controller('FollowingController', FollowingController)
        .controller('RepositoryController', RepositoryController)
        .controller('UserInfoController', UserInfoController);

    MainController.$inject = ['$scope', '$mdSidenav', '$request', '$location', 'github'];
    /* @ngInject */
    function MainController($scope, $mdSidenav, $request, $location, github) {
        var $ctrl = this;

        $ctrl.selectedTab = function() {
            var idx = 0;
            switch (github.mode) {
                case 'profile': idx = 0; break;
                case 'following': idx = 1; break;
                case 'repository': idx = 2; break;
                default: idx = 0; break;
            }
            return idx;
        };

        $scope.recent = $request.recent();
        $scope.favorites = $request.favorites();
        $scope.github = github;
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
                $location.path('/profile/' + request);
            }
        };

        // console.log($scope, $ctrl);
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

    FollowingController.$inject = ['$scope', 'github', '$log'];
    /* @ngInject */
    function FollowingController($scope, github, $log) {
        var mv = this;
        $scope.searchQuery = '';
        $scope.github = github;
        github.mode = 'following';

        this.$routerOnActivate = function(next) {
            if (next.params.who) {
                // console.log('FollowingController $routerOnActivate', next);
                $scope.searchQuery = next.params.who;
                github.search(next.params.who, function() {
                    mv.readyToShowResults = github.readyToShowResults;
                });
            }
            // $scope.location = $location;
            $log.log('FollowingController.$routerOnActivate', mv);
        };

        this.showNoResults = function() {
            // console.log(github.readyToShowResults, mv.info.users);
            return !(github.readyToShowResults && github.users && github.users.length > 0);
        };
        // console.log($scope, mv);
    }

    ProfileController.$inject = ['$scope', 'github', '$log'];
    /* @ngInject */
    function ProfileController($scope, github, $log) {
        var mv = this;
        mv.info = [];
        github.mode = 'profile';

        this.$routerOnActivate = function(next) {
            mv.login = next.params.who;
            mv.info = github.profile(next.params.who);
            $log.log('ProfileController.$routerOnActivate', mv);
        };
        // console.log($scope, mv);
    }

    RepositoryController.$inject = ['$scope', 'github', '$log'];
    /* @ngInject */
    function RepositoryController($scope, github, $log) {
        var mv = this;
        mv.info = [];
        $scope.github = github;
        github.mode = 'repository';

        this.$routerOnActivate = function(next) {
            mv.info = github.profile(next.params.who).repository(next.params.who, next.params.id);
            $log.log('RepositoryController.$routerOnActivate', mv);
        };

        mv.title = function() {
            var owner = mv.info.detailProfile.login ? mv.info.detailProfile.login : mv.info.login;
            return owner + ' / ' + mv.info.detailRepository.name;
        };
        // $log.log($scope, mv);
    }
})();
