angular.module('app.mainMenucontroller', []).controller('mainMenuCtrl', function($scope, $firebase, $restClient, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state, $ionicHistory, $firebaseArray, sharedCartService, sharedUtils) {
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.user_info = user; //Saves data to user_info
        } else {
            $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
            $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $rootScope.extras = false;
            sharedUtils.hideLoading();
            $state.go('tabsController.login', {}, {
                location: "replace"
            });
        }
    });
    // On Loggin in to menu page, the sideMenu drag state is set to true
    $ionicSideMenuDelegate.canDragContent(true);
    $rootScope.extras = true;
    // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
    $scope.$on('$ionicView.enter', function(ev) {
        if (ev.targetScope !== $scope) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }
    });

    $scope.isActive = function() {
        return true;
    };

    $scope.loadMenu = function() {
        $scope.onlyNumbers = /^\d+$/;
        $restClient.getProducts(function(msg) {
            console.log(JSON.stringify(msg));
            $scope.menu = msg.products;
        });
    }

    $scope.addToCart = function(a) {
        // console.log(JSON.stringify($scope.menu[a]));
        $rootScope.cartList.push({
            qty: "4",
            item: $scope.menu[a]
        });

        console.log(JSON.stringify($rootScope.cartList));
    }

    $scope.showProductInfo = function(id) {};

    $scope.getUserDetails = function() {
        $restClient.getUserDetails(function(msg) {
            console.log(JSON.stringify(msg));
        });
    };

    $scope.getPost = function() {
        // $restClient.getPost(1,function(msg){
        //     console.log(JSON.stringify(msg));
        // });

        $scope.auth = $firebaseArray(fireBaseData.ref());
        // $scope.menu.$loaded().then(function (items) {
        // $scope.menu = items;
        // console.log('=========>' + JSON.stringify(items)); // populated array
        // });

    };

})