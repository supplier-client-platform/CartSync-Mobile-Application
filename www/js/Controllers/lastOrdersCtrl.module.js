angular.module('app.lastOrdersController', [])

.controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils) {

    $rootScope.extras = true;
    sharedUtils.showLoading();

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $scope.user_info = user;

        fireBaseData.refOrder()
          .orderByChild('user_id')
          .startAt($scope.user_info.uid).endAt($scope.user_info.uid)
          .once('value', function (snapshot) {
            $scope.orders = snapshot.val();
            $scope.$apply();
          });
          sharedUtils.hideLoading();
      }
    });
})