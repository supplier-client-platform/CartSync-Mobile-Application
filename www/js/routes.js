angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController', {
    url: '/page1',
    templateUrl: 'app/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/page5',
    views: {
      'tab1': {
        templateUrl: 'app/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('tabsController.signup', {
    url: '/page6',
    views: {
      'tab3': {
        templateUrl: 'app/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('menu2', {
      url: '/page7',
      templateUrl: 'app/mainmenu.html',
      controller: 'mainMenuCtrl'
    })


  .state('offers', {
    url: '/page8',
    templateUrl: 'app/offers.html',
    controller: 'offersCtrl'
  })

  .state('myCart', {
    url: '/page9',
    templateUrl: 'app/myCart.html',
    controller: 'myCartCtrl'
  })

  .state('lastOrders', {
    url: '/page10',
    templateUrl: 'app/lastOrders.html',
    controller: 'lastOrdersCtrl'
  })

  .state('favourite', {
    url: '/page11',
    templateUrl: 'app/favourite.html',
    controller: 'favouriteCtrl'
  })

  .state('settings', {
    url: '/page12',
    templateUrl: 'app/settings.html',
    controller: 'settingsCtrl'
  })

  .state('support', {
    url: '/page13',
    templateUrl: 'app/support.html',
    controller: 'supportCtrl'
  })

  .state('checkout', {
    url: '/page16',
    templateUrl: 'app/checkout.html',
    controller: 'checkoutCtrl'
  })

  .state('tabsController.forgotPassword', {
    url: '/page15',
    views: {
      'tab1': {
        templateUrl: 'app/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page5')



});
