angular.module('app.controllers', [])
    .controller('navController', function($scope, $rootScope, $location) {
        $scope.isActive = function(a) {
            return a === $location.path();
        };
    })