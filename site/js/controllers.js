(function () {
    'use strict';

    angular
        .module('controllers', ['Providers'])
        .controller('GithubController', GithubController)
        .controller('ProfileController', ProfileController)
        .controller('RepositoryController', RepositoryController);

    GithubController.$inject = ['$rootScope', '$routeParams', '$location', 'githubSearch'];
    /* @ngInject */
    function GithubController($rootScope, $routeParams, $location, githubSearch) {
        var mv = this;

        $rootScope.location = $location;

        mv.newSearch = function (request) {
            $rootScope.backButtonShow = true;
            $rootScope.location.path('/search/' + request);
        };

        githubSearch.isShow = false;
        if ($routeParams.who) {
            $rootScope.searchQuery = $routeParams.who;
            mv.info = githubSearch.$get($routeParams.who);
        } else {
            $rootScope.backButtonShow = false;
            $rootScope.searchQuery = '';
        }
    }

    ProfileController.$inject = ['$rootScope', '$routeParams', 'githubSearch', 'githubProfile'];
    /* @ngInject */
    function ProfileController($rootScope, $routeParams, githubSearch, githubProfile) {
        var mv = this;

        $rootScope.backButtonShow = githubSearch.isShow;
        mv.login = $routeParams.id;
        mv.info = githubProfile.$get($routeParams.id);
    }

    RepositoryController.$inject = ['$rootScope', '$routeParams', 'githubProfile', 'githubRepository'];
    /* @ngInject */
    function RepositoryController($rootScope, $routeParams, githubProfile, githubRepository) {
        var mv = this;

        mv.info = githubRepository.$get($routeParams.owner, $routeParams.id);
        $rootScope.backButtonShow = githubProfile.isShow;
        mv.owner = githubProfile.$get($routeParams.owner);
    }
})();
