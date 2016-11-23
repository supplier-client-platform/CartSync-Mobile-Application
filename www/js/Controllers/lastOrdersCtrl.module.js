angular.module('app.lastOrdersController', [])

.controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils, $restClient) {

    $rootScope.extras = true;
    sharedUtils.showLoadingWithText("Retrieving last orders... ");

    $restClient.getAllOrders($rootScope.customerId,function(result){
      console.log(JSON.stringify(result));
      sharedUtils.hideLoading();
    });
})
