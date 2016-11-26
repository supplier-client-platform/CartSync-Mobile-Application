// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'rest-client', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'firebase', 'app.loginController', 'app.signupController', 'app.mainMenucontroller', 'app.offersController', 'app.indexController', 'app.myCartController', 'app.lastOrdersController', 'app.favouriteController', 'app.settingsController', 'app.supportController', 'app.forgotPasswordController', 'db-access', 'app.CheckoutController'])

.config(function($ionicConfigProvider) {
    //Added config
    //$ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c').previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
  })
  .run(function($ionicPlatform, $rootScope, $state, $dbService, $ionicHistory, $ionicSideMenuDelegate, sharedUtils) {
    $rootScope.cartList = [];
    $rootScope.favourites = [];
    $rootScope.extras = false;

    $rootScope.$secondaryBtn = 'Cart';
    $rootScope.$navigate = function() {
      switch ($rootScope.$secondaryBtn) {
        case "Cart":
          $state.go("myCart");
          return;
        case "Checkout":
          $state.go('checkout');
          return;
        default:
          return;
      }
    };

    $rootScope.$getClass = function(item) {
      switch (item) {
        case "Cart":
          return "ion-android-cart";
        case "Checkout":
          return "icon ion-arrow-right-c";
        default:
          return "";
      }
    };

    $rootScope.$getText = function(item) {
      switch (item) {
        case "Cart":
          return $rootScope.cartList.length;
        default:
          return "";
      }
    };


    $ionicPlatform.ready(function() {
      ionic.Platform.fullScreen();
      if (window.StatusBar) {
        return StatusBar.hide();
      }
      // Initialize SQLite DB
      $rootScope.db = $dbService.openDataConnection();
      $rootScope.db.init(function() {
        $rootScope.db.getUserData().then(function(res) {
          if (parseInt(res.rows.length) <= 0) {
            $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
            $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $rootScope.extras = false;
            sharedUtils.hideLoading();
            //$state.go('tabsController.login', {}, { location: "replace" });
          } else {
            $rootScope.customerId = res.rows.item(0).id;
            $rootScope.displayName = res.rows.item(0).displayName;
            $rootScope.telephone = res.rows.item(0).telephone;
            $rootScope.email = res.rows.item(0).email;
            $rootScope.uid = res.rows.item(0).uid;

            console.log("Data retrieved from db!! uid: " + JSON.stringify(res.rows.item(0).uid));
            console.log("Data retrieved from db!! displayName: " + JSON.stringify(res.rows.item(0).displayName));
            console.log("Data retrieved from db!! telephone: " + JSON.stringify(res.rows.item(0).telephone));
            console.log("Data retrieved from db!! email: " + JSON.stringify(res.rows.item(0).email));
            console.log("Data retrieved from db!! id: " + JSON.stringify(res.rows.item(0).id));

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
            $rootScope.extras = true;
            sharedUtils.hideLoading();
            $state.go('menu2', {}, {
              location: "replace"
            });
          }
        });
      });

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        console.log("came here");
        // org.apache.cordova.statusbar required
        //StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString("#25263a");
        ionic.Platform.fullScreen(true, true);
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      if (toState.name === "menu2") {
        $rootScope.$secondaryBtn = 'Cart';
      }
    });

  })
