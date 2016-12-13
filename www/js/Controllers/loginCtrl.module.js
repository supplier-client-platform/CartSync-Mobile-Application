angular.module('app.loginController', []).controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, fireBaseData, $ionicPopup, $timeout) {
    $rootScope.extras = false; // For hiding the side bar and nav icon
    $rootScope.userLoggedIn = false;
    $scope.resetData = {};
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $rootScope.userLoggedIn = true;
        }
        else {
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
    $scope.initLogin = function () {};
    $scope.goRegister = function () {
        $state.go('tabsController.signup', {}, {
            location: "replace"
        });
    };
    $scope.loginEmail = function (formName, cred) {
        if (formName.$valid) { // Check if the form data is valid or not
            sharedUtils.showLoadingWithText("Logging In...");
            // handle undefined error
            cred = cred ? cred : {};
            //Email
            firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                // $rootScope.db.cleanData();
                console.log("UID: " + result.uid);
                console.log("DisplayName: " + result.displayName);
                console.log("Email: " + result.email);
                fireBaseData.refUser().child(result.uid).once('value', function (snapshot) {
                    console.log(snapshot.val().telephone);
                    $rootScope.customerId = parseInt(snapshot.val().dbId);
                    $rootScope.db.insertUser(result.uid, result.displayName, parseInt(snapshot.val().telephone), result.email, parseInt(snapshot.val().dbId)).then(function (res) {
                        console.log("User data inserted!!");
                        if ($rootScope.userLoggedIn == true) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $rootScope.extras = true;
                            sharedUtils.hideLoading();
                            $state.go('menu2', {}, {
                                location: "replace"
                            });
                        }
                    });
                });
            }, function (error) {
                sharedUtils.hideLoading();
                sharedUtils.showAlert("Please note", "Authentication Error");
            });
        }
        else {
            sharedUtils.showAlert("Please note", "Entered data is not valid");
        }
    };
    $scope.forgotPassword = function () {
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="resetData.emailAddress">'
            , title: 'Password Reset'
            , subTitle: 'Please enter your email address'
            , scope: $scope
            , buttons: [
                {
                    text: 'Cancel'
                }
                , {
                    text: '<b>Reset Password</b>'
                    , type: 'button-balanced'
                    , onTap: function (e) {
                        if (!$scope.resetData.emailAddress) {
                            //don't allow the user to close unless he enters email address.
                            e.preventDefault();
                        }
                        else {
                            var auth = firebase.auth();
                            auth.sendPasswordResetEmail($scope.resetData.emailAddress).then(function () {
                                // Email sent.
                                $ionicPopup.alert({
                                    title: 'Email Sent Successfully'
                                    , template: 'Reset password link has been sent to your email address.'
                                });
                            }, function (error) {
                                // An error happened.
                                $ionicPopup.alert({
                                    title: 'Password reset failed'
                                    , template: 'Please check your email address and try again.'
                                });
                            });
                        }
                    }
                }]
        });
    };
    $scope.loginFb = function () {
        //Facebook Login
    };
    $scope.loginGmail = function () {
        //Gmail Login
    };
})
