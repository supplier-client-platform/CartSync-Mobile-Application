angular.module('app.myCartController', [])

.controller('myCartCtrl', function($scope, $rootScope, $state, $ionicPopup, sharedCartService, $restClient, $ionicHistory, $ionicScrollDelegate) {

  $scope.quantity = 0;

  $rootScope.$secondaryBtn = 'Checkout';
  $scope.initCart = function() {
    $scope.loadImages();
    //$ionicHistory.clearHistory();
  }

  $scope.images = [];

  $scope.loadImages = function() {
    for(var i = 0; i < 100; i++) {
      $scope.images.push({id: i, src: "http://placehold.it/50x50"});
    }
  }

  $scope.calculateTotal = function() {
    var total = 0;
    for (var i = 0; i < $rootScope.cartList.length; i++) {
      total = total + ($rootScope.cartList[i].qty * $rootScope.cartList[i].item.price);
    }
    return total;
  };

  $scope.increaseQty = function () {
    $scope.quantity = parseInt($scope.quantity) + 1;
  };
  $scope.decreaseQty = function () {
    $scope.quantity = parseInt($scope.quantity) - 1;
  }
  $scope.$watch('quantity', function () {
    $scope.quantity = parseInt($scope.quantity);
  });

  $scope.addToCart = function (a) {
    $scope.quantity = 0;
    $scope.i = 0;
    var itemId = a.id;
    console.log(itemId);
    //console.log("Item: " + JSON.stringify(a));
    for (var i = 0; i < $rootScope.menu.length; i++) {
      $scope.i = i;
      if (parseInt($rootScope.menu[i].id) == parseInt(itemId)) {
        if ($rootScope.menu[i].isAdded == true) {
          $scope.removeFromCart(itemId);
        }
        else {
          $ionicPopup.show({
            template: '<div class="stepper row" style="font-size:29px"><button class="stepper__btn--decr" ng-disabled="quantity == 0" ng-click="decreaseQty()" style=" width: 20%">-</button><input style=" width: 70%" type="number" class="stepper__input" pattern="[0-9]" value="0" ng-model="quantity"/><button style=" width: 20%" ng-click="increaseQty()" class="stepper__btn--incr">+</button></div>'
            , title: 'Please Enter Quantity'
            , scope: $scope
            , buttons: [{
              text: 'Cancel'
            }, {
              text: '<b>Save</b>'
              , type: 'button-positive'
              , onTap: function (e) {
                if ($scope.quantity == 0) {
                  //don't allow the user to close unless he enters quantity
                  e.preventDefault();
                }
                else {
                  console.log($scope.quantity);
                  $rootScope.menu[$scope.i].isAdded = true;
                  console.log(JSON.stringify($rootScope.menu[$scope.i]));
                  $rootScope.cartList.push({
                    qty: $scope.quantity
                    , item: $rootScope.menu[$scope.i]
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
    var itemId = a.id;
    console.log(itemId);
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
              for (var j = 0; j < $rootScope.menu.length; j++) {
                if ($rootScope.menu[j].id == itemId) {
                  $rootScope.menu[j].isAdded = false;
                };
              }
            }
          }
        }
      }]
    });
  };

  $scope.checkout = function() {
    // A confirm dialog
    var confirmPopup = $ionicPopup.confirm({
      title: 'Place Order?',
      template: 'Are you sure you want place the order?'
    }).then(function(res) {
      var total = parseFloat($scope.calculateTotal()).toFixed(2);
      if (res) {
        var shopping_list = [];

        for(var i=0 ; i<$rootScope.cartList.length; i++){
          shopping_list.push({
            "productID": $rootScope.cartList[i].item.id,
            "productName": $rootScope.cartList[i].item.name,
            "productBrand": $rootScope.cartList[i].item.brandname,
            "productquantity": $rootScope.cartList[i].qty,
            "totalprice": $rootScope.cartList[i].qty * $rootScope.cartList[i].item.price
          });
        };


        var order = {
          "customer_id": $rootScope.customerId,
          "gross_total": total,
          "discount": 0,
          "net_total": total,
          "supplier_id": $rootScope.selectedShop,
          "shopping_list": shopping_list
        };

        $restClient.makeOrder(order,function(res){
            console.log(JSON.stringify(res));
            $rootScope.cartList = [];

            for (var i = 0; i < $rootScope.menu.length; i++) {
              $rootScope.menu[i].isAdded = false;
            };

            $state.go('menu2', {}, { location: "replace" });
        });
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.increase = function(a) {
    $rootScope.cartList[a].qty = parseInt($rootScope.cartList[a].qty) + 1;
    console.log($rootScope.cartList[a].qty);
  };

  $scope.decrease = function(a) {
    if (parseInt($rootScope.cartList[a].qty) == 0) {

      var alertPopup = $ionicPopup.alert({
        title: 'Cannto decrease below zero',
        template: 'Item quantity cannot be below zero.'
      });

      alertPopup.then(function(res) {});

    } else {
      $rootScope.cartList[a].qty = parseInt($rootScope.cartList[a].qty) - 1;
      console.log($rootScope.cartList[a].qty);
    }
  };


})
