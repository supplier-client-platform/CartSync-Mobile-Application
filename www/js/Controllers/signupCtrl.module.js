angular.module('app.signupController', [])

.controller('signupCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate, $restClient,
    $state, fireBaseData, $ionicHistory) {

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {}else{
            $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
            $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $rootScope.extras = false;
            sharedUtils.hideLoading();
            $state.go('tabsController.signup', {}, {location: "replace"});
        }
    });

    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function(formName, cred) {

        if (formName.$valid) { // Check if the form data is valid or not

            sharedUtils.showLoading();

            //Main Firebase Authentication part
            firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function(result) {
              var userdetails = {};

                //Add name and default dp to the Autherisation table
                result.updateProfile({
                    displayName: cred.name,
                    photoURL: "default_dp"
                }).then(function() {}, function(error) {});

                //Add phone number to the user table
                fireBaseData.refUser().child(result.uid).set({
                    telephone: cred.phone
                });

                //Registered OK
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                var userdetails = {
                  displayName: cred.name,
                  email: result.email,
                  telephone: cred.phone,
                  uid: result.uid
                };

                  $restClient.registerUser(userdetails,function(customer){
                    console.log("User reg res" + customer.customer.id);

                    $rootScope.db.insertUser(userdetails.uid,userdetails.displayName,parseInt(cred.phone),userdetails.email,parseInt(customer.customer.id)).then(function(res){
                      console.log("Lol data inserted!!");

                      fireBaseData.refUser().child(result.uid).set({
                          dbId: customer.customer.id,
                          telephone: cred.phone
                      });

                      setTimeout(function(){
                        $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
                        $rootScope.extras = true;
                        sharedUtils.hideLoading();
                        $state.go('menu2', {}, { location: "replace" });
                      },100);
                    });
                  });

            }, function(error) {
                sharedUtils.hideLoading();
                sharedUtils.showAlert("Please note", "Sign up Error");
            });

        } else {
            sharedUtils.showAlert("Please note", "Entered data is not valid");
        }

    };

    $scope.goLogin = function(){
      $state.go('tabsController.login', {}, { location: "replace" });
    };

})
