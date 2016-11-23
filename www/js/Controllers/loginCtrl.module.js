angular.module('app.loginController', [])

    .controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, fireBaseData) {
        $rootScope.extras = false; // For hiding the side bar and nav icon

        // When the user logs out and reaches login page,
        // we clear all the history and cache to prevent back link
        $scope.$on('$ionicView.enter', function (ev) {
            if (ev.targetScope !== $scope) {
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            }
        });

        //Check if user already logged in
        // firebase.auth().onAuthStateChanged(function (user) {
        //     if (user) {
        //
        //         $ionicHistory.nextViewOptions({
        //             historyRoot: true
        //         });
        //         $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
        //         $rootScope.extras = true;
        //         sharedUtils.hideLoading();
        //         $state.go('menu2', {}, { location: "replace" });
        //
        //     } else {
        //         $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        //         $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
        //
        //         $ionicHistory.nextViewOptions({
        //             historyRoot: true
        //         });
        //         $rootScope.extras = false;
        //         sharedUtils.hideLoading();
        //         $state.go('tabsController.login', {}, { location: "replace" });
        //     }
        // });

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

                    // You dont need to save the users session as firebase handles it
                    // You only need to :
                    // 1. clear the login page history from the history stack so that you cant come back
                    // 2. Set rootScope.extra;
                    // 3. Turn off the loading
                    // 4. Got to menu page

                  //   NSString *uid = profile.uid;  // Provider-specific UID
                  //  NSString *name = profile.displayName;
                  //  NSString *email = profile.email;

                    // console.log("UID: " + result.uid);
                    // console.log("DisplayName: " + result.displayName);
                    // console.log("Email: " + result.email);
                    // fireBaseData.refUser().child(result.uid).once('value',function(snapshot){
                    //   console.log(snapshot.val().telephone);
                    //   $rootScope.db.insertUser(result.uid,result.displayName,parseInt(snapshot.val().telephone),result.email).then(function(res){
                    //     console.log("Lol data inserted!!");
                    //   });
                    //
                    //   $rootScope.db.getUserData().then(function(res){
                    //     console.log("Lol data retrieved!! " + JSON.stringify(res.rows.item(0).uid));
                    //     console.log("Lol data retrieved!! " + JSON.stringify(res.rows.item(0).displayName));
                    //     console.log("Lol data retrieved!! " + JSON.stringify(res.rows.item(0).telephone));
                    //     console.log("Lol data retrieved!! " + JSON.stringify(res.rows.item(0).email));
                    //   });
                    // });



                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $rootScope.extras = true;
                    sharedUtils.hideLoading();
                    $state.go('menu2', {}, { location: "replace" });

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
