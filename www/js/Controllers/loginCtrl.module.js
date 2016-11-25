angular.module('app.loginController', [])

    .controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, fireBaseData) {
        $rootScope.extras = false; // For hiding the side bar and nav icon
        $rootScope.userLoggedIn = false;

        //Check if user already logged in
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              $rootScope.userLoggedIn = true;
            } else {
              $rootScope.userLoggedIn = false;
            }
        });

        // When the user logs out and reaches login page,
        // we clear all the history and cache to prevent back link
        $scope.$on('$ionicView.enter', function (ev) {
            if (ev.targetScope !== $scope) {
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            }
        });

        $scope.initLogin = function(){
        };

        $scope.goRegister = function(){
          $state.go('tabsController.signup', {}, { location: "replace" });
        };

        $scope.loginEmail = function (formName, cred) {
            if (formName.$valid) { // Check if the form data is valid or not
                sharedUtils.showLoading();
                // handle undefined error
                cred = cred ? cred : {};

                //Email
                firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                  $rootScope.db.cleanData();

                  console.log("UID: " + result.uid);
                  console.log("DisplayName: " + result.displayName);
                  console.log("Email: " + result.email);
                  fireBaseData.refUser().child(result.uid).once('value',function(snapshot){
                    console.log(snapshot.val().telephone);
                    $rootScope.db.insertUser(result.uid,result.displayName,parseInt(snapshot.val().telephone),result.email,parseInt(snapshot.val().dbId)).then(function(res){
                      console.log("User data inserted!!");

                      if($rootScope.userLoggedIn == true){
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $rootScope.extras = true;
                        sharedUtils.hideLoading();
                        $state.go('menu2', {}, { location: "replace" });
                      }
                    });
                  });
                },
                    function (error) {
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert("Please note", "Authentication Error");
                    }
                );
            } else {
                sharedUtils.showAlert("Please note", "Entered data is not valid");
            }



        };


        $scope.loginFb = function () {
            //Facebook Login
        };

        $scope.loginGmail = function () {
            //Gmail Login
        };


    })
