/**
 * All the controllers
 *
 * @namespace controllers
 */
(function () {
    'use strict';

    angular
        .module('controllers', ['Github'])
        .controller('GithubController', GithubController)
        .controller('ProfileController', ProfileController)
        .controller('RepositoryController', RepositoryController);

    GithubController.$inject = ['$rootScope', '$routeParams', '$location', 'github'];
    /* @ngInject */
    function GithubController($rootScope, $routeParams, $location, github) {
        var mv = this;

        $rootScope.location = $location;

        mv.newSearch = function (request) {
            $rootScope.backButtonShow = true;
            $rootScope.location.path('/search/' + request);
        };

        github.isShowSearch = false;

        if ($routeParams.who) {
            $rootScope.searchQuery = $routeParams.who;
            mv.info = github.search($routeParams.who);
        } else {
            $rootScope.backButtonShow = false;
            $rootScope.searchQuery = '';
            mv.info = [];
        }
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
    function RepositoryController($rootScope, $routeParams, github, $log) {
        var mv = this;

        mv.info = github.repository($routeParams.owner, $routeParams.id);
        $rootScope.backButtonShow = github.isShowProfile;
        mv.owner = github.profile($routeParams.owner);
        mv.title = function() {
            var owner = mv.owner.detailProfile.login ? mv.owner.detailProfile.login : mv.info.owner;
            return owner + ' / ' + mv.info.detailRepository.name;
        };
        $log.info(mv.info);
    }
})();
