/**
 * All the controllers
 *
 * @namespace Controllers
 */
(function () {
    'use strict';

    angular
        .module('controllers', ['Github', 'ngMaterial', 'ngMessages'])
        .controller('SearchController', SearchController)
        .controller('GithubController', GithubController)
        .controller('ProfileController', ProfileController)
        .controller('RepositoryController', RepositoryController);

    SearchController.$inject = ['$location'];
    /* @ngInject */
    function SearchController($location) {
        var mv = this;

        mv.isShowResults = false;
        mv.backButtonShow = false;
        console.log(mv);

        mv.newSearch = function (request) {
            console.log(request);
            mv.backButtonShow = true;
            mv.isShowResults = true;
            $location.path('/search/' + request);
        };

        mv.back = function() {
            console.log('back is pressed');
            $location.path('/');
        };

        mv.$routerOnActivate = function(next) {
            console.log('SearchController $routerOnActivate', next);
        };
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
