angular.module('app.lastOrdersController', [])

.controller('lastOrdersCtrl', function($scope, $rootScope, fireBaseData, sharedUtils, $restClient, $q) {
  $scope.myOrders = {};

  $scope.retrieveOrders = function(a) {
    $rootScope.notificationCount = 0;
    if (a == '') {
      sharedUtils.showLoadingWithText("Retrieving last orders... ");
      $restClient.getAllOrders(a, function(msg) {
        $scope.myOrders = msg;
        console.log(JSON.stringify($scope.myOrders));
        sharedUtils.hideLoading();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    } else if (a === null) {}else {
      sharedUtils.showLoadingWithText("Retrieving more... ");
      $restClient.getAllOrders(a, function(msg) {
        for (var i = 0; i < msg.data.length; i++) {
          $scope.myOrders.data.push(msg.data[i]);
        }
        $scope.myOrders.next_page_url = msg.next_page_url;
        console.log(JSON.stringify($scope.myOrders));
        sharedUtils.hideLoading();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
  };
})
