angular.module('app.myCartController', [])

.controller('myCartCtrl', function($scope, $rootScope, $state, $ionicPopup, sharedCartService, $restClient) {

    $scope.initCart = function() {

    }

    $scope.calculateTotal = function() {
        var total = 0;
        for (var i = 0; i < $rootScope.cartList.length; i++) {
            total = total + ($rootScope.cartList[i].qty * $rootScope.cartList[i].item.price);
        }
        return total;
    };

    $scope.removeFromCart = function(a) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove item from List?',
            template: 'Are you sure you want to remove this item from the Cart List?',
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'NO',
                type: 'button-default',
                onTap: function(e) {}
            }, {
                text: 'REMOVE',
                type: 'button-assertive',
                onTap: function(e) {
                    $rootScope.cartList.splice(a, 1);
                }
            }]
        });
    };

    $scope.checkout = function() {
        $restClient.makeOrder(555, function(msg) {
            console.log(JSON.stringify(msg));
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