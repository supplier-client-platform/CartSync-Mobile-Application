angular.module('app.mainMenucontroller', []).controller('mainMenuCtrl', function($scope, $ionicModal, $firebase, $restClient, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state, $ionicHistory, $firebaseArray, $ionicPopup, sharedCartService, sharedUtils, $ionicLoading) {
  $scope.quantity = 0;
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

  $scope.retrieveProducts = function(id) {
    $rootScope.selectedShop = id;
    sharedUtils.showLoadingWithText("Retrieving products... ");

    $restClient.getProducts(id, function(msg) {
      $scope.menu = msg.data;

      for (var i = 0; i < $scope.menu.length; i++) {
        $scope.menu[i].isAdded = false;
      };

      sharedUtils.hideLoading();
      $scope.closeModal();
    });

  };

  $scope.loadMenu = function() {
    sharedUtils.showLoadingWithText("Retrieving Shops...");
    $scope.onlyNumbers = /^\d+$/;

    $restClient.getAllBusiness(function(res) {
      $rootScope.allShops = res;
      sharedUtils.hideLoading();
    });

    $rootScope.db.getUserData().then(function(res) {
      console.log("Data retrieved from db!! uid: " + JSON.stringify(res.rows.item(0).uid));
      console.log("Data retrieved from db!! displayName: " + JSON.stringify(res.rows.item(0).displayName));
      console.log("Data retrieved from db!! telephone: " + JSON.stringify(res.rows.item(0).telephone));
      console.log("Data retrieved from db!! email: " + JSON.stringify(res.rows.item(0).email));
      console.log("Data retrieved from db!! id: " + JSON.stringify(res.rows.item(0).id));
    });
    //alert(JSON.stringify($scope.user_info));
    setTimeout(function() {
      $scope.openModal();
    }, 100);

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
      } else {
        return false;
      }
    }
  };

  $scope.increaseQty = function(){
    $scope.quantity = parseInt($scope.quantity) + 1;
  };

  $scope.decreaseQty = function(){
    $scope.quantity = parseInt($scope.quantity) - 1;
  }

  $scope.$watch('quantity', function() {
        $scope.quantity = parseInt($scope.quantity);
    });

  $scope.addToCart = function(a) {
    $scope.quantity = 0;
    $scope.i = 0;
    var itemId = a.id;
    console.log(itemId);
    //console.log("Item: " + JSON.stringify(a));

    for (var i = 0; i < $scope.menu.length; i++) {
      $scope.i = i;
      if (parseInt($scope.menu[i].id) == parseInt(itemId)) {
        if ($scope.menu[i].isAdded == true) {
          $scope.removeFromCart(itemId);
        } else {

          $ionicPopup.show({
            template: '<div class="stepper row" style="font-size:29px"><button class="stepper__btn--decr" ng-disabled="quantity == 0" ng-click="decreaseQty()" style=" width: 20%">-</button><input style=" width: 70%" type="number" class="stepper__input" pattern="[0-9]" value="0" ng-model="quantity"/><button style=" width: 20%" ng-click="increaseQty()" class="stepper__btn--incr">+</button></div>',
            title: 'Please Enter Quantity',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if ($scope.quantity == 0) {
                  //don't allow the user to close unless he enters quantity
                  e.preventDefault();
                } else {
                  console.log($scope.quantity);
                  $scope.menu[$scope.i].isAdded = true;
                  console.log(JSON.stringify($scope.menu[$scope.i]));

                  $rootScope.cartList.push({
                    qty: $scope.quantity,
                    item: $scope.menu[$scope.i]
                  });
                }
              }
            }]
          });
          break;
        }
      }
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
          for (var i = 0; i < $rootScope.cartList.length; i++) {
            if ($rootScope.cartList[i].item.id == itemId) {
              $rootScope.cartList.splice(i, 1);
              for (var j = 0; j < $scope.menu.length; j++) {
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
