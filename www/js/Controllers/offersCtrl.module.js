angular.module('app.offersController', [])

.controller('offersCtrl', function($scope, $rootScope) {
  $scope.myFavourites = [];

  //We initialise it on all the Main Controllers because, $rootScope.extra has default value false
  // So if you happen to refresh the Offer page, you will get $rootScope.extra = false
  //We need $ionicSideMenuDelegate.canDragContent(true) only on the menu, ie after login page
  $rootScope.extras = true;

  // $scope.initFavourites = function() {
  //   for (var i = 0; i < $rootScope.menu.length; i++) {
  //     if ($rootScope.favourites.indexOf($rootScope.menu[i].id) !== -1) {
  //       $scope.myFavourites.push($rootScope.menu[i]);
  //     }
  //   }
  // };
})
