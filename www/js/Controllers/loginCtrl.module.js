angular.module('app.loginController', [])

.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
    $rootScope.extras = false;  // For hiding the side bar and nav icon

    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });




    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('menu2', {}, {location: "replace"});

      }
    });


    $scope.loginEmail = function(formName,cred) {


      if(formName.$valid) {  // Check if the form data is valid or not

          sharedUtils.showLoading();

          //Email
          firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {

                // You dont need to save the users session as firebase handles it
                // You only need to :
                // 1. clear the login page history from the history stack so that you cant come back
                // 2. Set rootScope.extra;
                // 3. Turn off the loading
                // 4. Got to menu page

              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              $rootScope.extras = true;
              sharedUtils.hideLoading();
              $state.go('menu2', {}, {location: "replace"});

            },
            function(error) {
              sharedUtils.hideLoading();
              sharedUtils.showAlert("Please note","Authentication Error");
            }
        );

      }else{
        sharedUtils.showAlert("Please note","Entered data is not valid");
      }



    };


    $scope.loginFb = function(){
      //Facebook Login
    };

    $scope.loginGmail = function(){
      //Gmail Login
    };


})