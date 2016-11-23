angular.module('app.mainMenucontroller', []).controller('mainMenuCtrl', function($scope, $ionicModal,$firebase, $restClient, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state, $ionicHistory, $firebaseArray, $ionicPopup, sharedCartService, sharedUtils) {
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
        // $restClient.getProducts(function(msg) {
        //     //console.log(JSON.stringify(msg));
        //     $scope.menu = msg.data;
        //
        //     for (var i = 0; i < $scope.menu.length; i++) {
        //         $scope.menu[i].isAdded = false;
        //     };
        // });

        $restClient.getAllBusiness(function(res){
          $rootScope.allShops = res;
        });

          $rootScope.db.getUserData().then(function(res){
            console.log("Data retrieved from db!! uid: " + JSON.stringify(res.rows.item(0).uid));
            console.log("Data retrieved from db!! displayName: " + JSON.stringify(res.rows.item(0).displayName));
            console.log("Data retrieved from db!! telephone: " + JSON.stringify(res.rows.item(0).telephone));
            console.log("Data retrieved from db!! email: " + JSON.stringify(res.rows.item(0).email));
            console.log("Data retrieved from db!! id: " + JSON.stringify(res.rows.item(0).id));
          });
        //alert(JSON.stringify($scope.user_info));
        setTimeout(function(){
          $scope.openModal();
        },100);

    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.isAdded = function(a) {
        var itemId = $scope.menu[a].id;
        for (var i = 0; i < $rootScope.cartList.length; i++) {
            if ($rootScope.cartList[i].item.id == itemId) {
                return true;
            }
            else{
                return false;
            }
        }
    };

    $scope.addToCart = function(a) {
        var itemId = $scope.menu[a].id;

        if ($scope.menu[a].isAdded == true) {
            $scope.removeFromCart(itemId);
        } else {
            console.log("UserInfo " + $scope.user_info.email);
            $scope.menu[a].isAdded = true;
            console.log(JSON.stringify($scope.menu[a]));

            $rootScope.cartList.push({
                qty: "0",
                item: $scope.menu[a]
             });
        }
    };

    $scope.removeFromCart = function(a) {
        var itemId = a;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove item from List?',
            template: 'Are you sure you want to remove this item from the Cart List?',
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'No',
                type: 'button-default',
                onTap: function(e) {}
            }, {
                text: 'Remove',
                type: 'button-assertive',
                onTap: function(e) {
                    for(var i=0; i < $rootScope.cartList.length; i++){
                        if($rootScope.cartList[i].item.id == itemId){
                            $rootScope.cartList.splice(i, 1);
                            for(var j =0 ; j< $scope.menu.length ; j++){
                                if ($scope.menu[j].id == itemId) {
                                    $scope.menu[j].isAdded = false;
                                };
                            }
                        }
                    }
                }
            }]
        });
    };

    $scope.showProductInfo = function(id) {};

    $scope.getUserDetails = function() {
        $restClient.getUserDetails(function(msg) {
            console.log(JSON.stringify(msg));
        });
    };

})
