/**
 * rest-client Module
 *
 * Description
 */
angular.module('rest-client', []).
config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.headers.put = $httpProvider.defaults.headers.post;
}]).
factory('$restClient', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
  return {
    getUserDetails: function(callBack) {
      $http({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users',
        data: ''
      }).success(function(msg) {
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    getPost: function(postNo, callBack) {
      $http({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts',
        params: {
          userId: 1
        }
      }).success(function(msg) {
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    getAllBusiness: function(callBack) {
      $http({
        method: 'GET',
        url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/business/all'
      }).success(function(msg) {
        //console.log("All Products: " + JSON.stringify(msg.data));
        callBack(msg.data);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    getProducts: function(id, callBack) {
      $http({
        method: 'GET',
        url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/product/all',
        params: {
          marketPlaceId: id
        }
      }).success(function(msg) {
        //console.log("All Products: " + JSON.stringify(msg.data));
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    registerUser: function(userdata, callBack) {
      $http({
        method: 'POST',
        url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/customer/create/new',
        params: userdata
      }).success(function(msg) {
        //console.log("All Products: " + JSON.stringify(msg.data));
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    getAllOrders: function(nextPage, callBack) {
      $http({
        method: 'GET',
        url: (nextPage == '' ? 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/order/all' : nextPage),
        params: {
          marketPlaceId: $rootScope.selectedShop,
          contact_number: $rootScope.telephone
        }
      }).success(function(msg) {
        //console.log(JSON.stringify(msg));
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    },
    makeOrder: function(order, callBack) {
      console.log(JSON.stringify(order));

      $http({
        method: 'POST',
        url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/order/create/new',
        headers: {
          "content-type": "application/json"
        },
        data: order
      }).success(function(msg) {
        //console.log("Create order res: " + JSON.stringify(msg));
        callBack(msg);
      }).error(function(err) {
        console.log(err);
        callBack('error');
      });
    }
  };
}]);
