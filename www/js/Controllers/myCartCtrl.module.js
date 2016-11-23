angular.module('app.myCartController', [])

.controller('myCartCtrl', function($scope, $rootScope, $state, $ionicPopup, sharedCartService, $restClient, $ionicHistory) {

  $rootScope.$secondaryBtn = 'Checkout';
  $scope.initCart = function() {
    //$ionicHistory.clearHistory();
  }

  $scope.calculateTotal = function() {
    var total = 0;
    for (var i = 0; i < $rootScope.cartList.length; i++) {
      total = total + ($rootScope.cartList[i].qty * $rootScope.cartList[i].item.price);
    }
    return total;
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
