angular.module('app.mainMenucontroller', []).controller('mainMenuCtrl', function ($scope, $ionicModal, $firebase, $restClient, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state, $ionicHistory, $firebaseArray, $ionicPopup, sharedCartService, sharedUtils, $ionicLoading) {

    $scope.quantity = 0;
    $rootScope.cartList = [];
    $rootScope.favourites = [];
    $scope.searchInput = "";
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $scope.user_info = user; //Saves data to user_info
        }
        else {
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
    $scope.$on('$ionicView.enter', function (ev) {
        if (ev.targetScope !== $scope) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }
    });
    $scope.isFavourite = function (item) {
        return ($rootScope.favourites.indexOf(item.id) === -1 ? 'false' : 'true');
    };
    $scope.addFavourite = function (item) {
        console.log("Add called");
        // console.log("storeId: " + $rootScope.selectedShop);
        var itemId = item.id;
        var storeId = $rootScope.selectedShop;
        if ($rootScope.favourites.indexOf(itemId) == -1) {
            $rootScope.db.insertFavourite(storeId, itemId).then(function (result) {
                console.log("Favourite Added: " + JSON.stringify(result));
                $rootScope.favourites.push(itemId);
                $scope.retrieveFavourites(storeId);
            });
        }
        else {
            $rootScope.db.deleteFavourite(storeId, itemId).then(function (result) {
                console.log("Favourite Removed: " + JSON.stringify(result));
                $rootScope.favourites.splice($rootScope.favourites.indexOf(itemId), 1);
                $scope.retrieveFavourites(storeId);
            });
        };
    };
    $scope.retrieveFavourites = function (storeId) {
        console.log("Retrieving fav for shop " + storeId);
        $rootScope.db.getFavourites("" + storeId).then(function (result) {
            if (result.rows.length <= 0) {
                $rootScope.favourites = [];
                console.log("No favs in DB");
            }
            else {
                console.log("Favs in DB" + result.rows.length);
                for (var i = 0; i < result.rows.length; i++) {
                    if ($rootScope.favourites.indexOf(parseInt(result.rows.item(i).itemId)) == -1) {
                        $rootScope.favourites.push(parseInt(result.rows.item(i).itemId));
                    }
                }
                console.log("Fav DB: " + JSON.stringify($rootScope.favourites));
            }
        });
    };
    $scope.retrieveProducts = function (id) {
        if ($rootScope.modal) $rootScope.modal.remove();
        var storeId = (id == 'refresh' ? $rootScope.selectedShop : id);
        console.log("Retrieving products for shop " + storeId);
        $scope.retrieveFavourites(storeId);
        if (id === 'refresh') {
            sharedUtils.showLoadingWithText("Retrieving products... ");
            $restClient.getProducts($rootScope.selectedShop, function (msg) {
                $rootScope.menu = msg.data;
                for (var i = 0; i < $rootScope.menu.length; i++) {
                    $rootScope.menu[i].isAdded = false;
                };
                sharedUtils.hideLoading();
                $scope.$broadcast('scroll.refreshComplete');
                return;
            });
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Save your choice?'
                , template: 'Do you want to save your choice?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    localStorage.setItem("selectedShop", id);
                    $rootScope.selectedShop = id;
                    sharedUtils.showLoadingWithText("Retrieving products... ");
                    $restClient.getProducts(id, function (msg) {
                        $rootScope.menu = msg.data;
                        for (var i = 0; i < $rootScope.menu.length; i++) {
                            $rootScope.menu[i].isAdded = false;
                        };
                        sharedUtils.hideLoading();
                        $scope.closeModal();
                    });
                }
                else {
                    $rootScope.selectedShop = id;
                    sharedUtils.showLoadingWithText("Retrieving products... ");
                    $restClient.getProducts(id, function (msg) {
                        $rootScope.menu = msg.data;
                        for (var i = 0; i < $rootScope.menu.length; i++) {
                            $rootScope.menu[i].isAdded = false;
                        };
                        sharedUtils.hideLoading();
                        $scope.closeModal();
                    });
                }
            });
        }
    };

    $rootScope.initPusher = function () {
      $rootScope.initSuccess = true;
      var pusher = new Pusher($rootScope.PUSHER_APPKEY);
      var order = pusher.subscribe($rootScope.PUSHER_CHANNEL);


      pusher.connection.bind('connected', function() {
        console.log('Pusher Connected. Realtime is go!');
      });

      order.bind("order_mobile_notifications" + $rootScope.customerId, function (data) {
        console.log("order_mobile_notifications!!!");
        $rootScope.notificationCount += 1;
        console.log($rootScope.notificationCount);
        console.log(JSON.stringify(data));
        $rootScope.$apply();
      });
    };

    $rootScope.loadMenu = function (a) {
        if($rootScope.initSuccess === undefined) $rootScope.initPusher();

        if (localStorage.getItem("selectedShop") == undefined || a === 'switch') {
            sharedUtils.showLoadingWithText("Retrieving Shops...");
            $scope.onlyNumbers = /^\d+$/;
            $restClient.getAllBusiness(function (res) {
                $rootScope.allShops = res;
                sharedUtils.hideLoading();
            });
            // $rootScope.db.getUserData().then(function(res) {
            //
            // });
            //alert(JSON.stringify($scope.user_info));
            setTimeout(function () {
                $scope.openModal();
            }, 100);
        }
        else {
            setTimeout(function () {
                var selectedSeller = parseInt(localStorage.getItem("selectedShop"));
                sharedUtils.showLoadingWithText("Retrieving products... ");
                console.log("Selected seller: " + selectedSeller);
                $rootScope.selectedShop = selectedSeller;
                $rootScope.menu = [];
                $restClient.getProducts(selectedSeller, function (msg) {
                    $scope.retrieveFavourites(selectedSeller);
                    $rootScope.menu = msg.data;
                    for (var i = 0; i < $rootScope.menu.length; i++) {
                        $rootScope.menu[i].isAdded = false;
                    };
                    // $scope.retrieveFavourites(selectedSeller);
                    sharedUtils.hideLoading();
                    // console.log($rootScope.modal.isShown());
                    if ($rootScope.modal.isShown()) {
                        $scope.closeModal();
                    }
                });
            }, 700);
        }
    };
    if ($rootScope.modal) $rootScope.modal.remove();
    $ionicModal.fromTemplateUrl('app/shopSelection.html', {
        scope: $scope
        , animation: 'slide-in-up'
    }).then(function (modal) {
        $rootScope.modal = modal;
    });
    $scope.openModal = function () {
        $rootScope.modal.show();
    };
    $scope.closeModal = function () {
        $rootScope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $rootScope.modal.remove();
    });
    // Execute action on hide modal
    $rootScope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $rootScope.$on('modal.removed', function () {
        // Execute action
    });
    $scope.isAdded = function (a) {
        var itemId = $rootScope.menu[a].id;
        for (var i = 0; i < $rootScope.cartList.length; i++) {
            if ($rootScope.cartList[i].item.id == itemId) {
                return true;
            }
            else {
                return false;
            }
        }
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
    $scope.removeFromCart = function (a) {
        var itemId = a;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove item from List?'
            , template: 'Are you sure you want to remove this item from the Cart List?'
            , buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'No'
                , type: 'button-default'
                , onTap: function (e) {}
      }, {
                text: 'Remove'
                , type: 'button-assertive'
                , onTap: function (e) {
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
    $scope.showProductInfo = function (id) {};
    $scope.getUserDetails = function () {
        $restClient.getUserDetails(function (msg) {
            console.log(JSON.stringify(msg));
        });
    };
})
