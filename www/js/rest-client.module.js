/**
 * rest-client Module
 *
 * Description
 */
angular.module('rest-client', []).
    config(['$httpProvider', function ($httpProvider) {
        //set api authentication in the request header
        $httpProvider.defaults.headers.post = {
            'X-USERNAME': 'apiuser'
            , 'X-PASSWORD': 'api!#1*'
            , 'Content-Type': 'application/x-www-form-urlencoded'
        };
        $httpProvider.defaults.headers.put = $httpProvider.defaults.headers.post;
    }]).
    factory('$restClient', ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            getUserDetails: function (callBack) {
                $http({
                    method: 'GET'
                    , url: 'https://jsonplaceholder.typicode.com/users'
                    , data: ''
                }).success(function (msg) {
                    callBack(msg);
                }).error(function (err) {
                    console.log(err);
                    callBack('error');
                });
            },
            getPost: function (postNo, callBack) {
                $http({
                    method: 'GET'
                    , url: 'https://jsonplaceholder.typicode.com/posts'
                    , params: { userId: 1 }
                }).success(function (msg) {
                    callBack(msg);
                }).error(function (err) {
                    console.log(err);
                    callBack('error');
                });
            },
            getProducts: function (callBack) {
                $http({
                    method: 'GET'
                    , url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/product/all'
                    , params: { marketPlaceId : 1 }
                }).success(function (msg) {
                    //console.log("All Products: " + JSON.stringify(msg.data));
                    callBack(msg);
                }).error(function (err) {
                    console.log(err);
                    callBack('error');
                });
            },
            registerUser: function (userdata, callBack) {
                $http({
                    method: 'POST'
                    , url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/customer/create/new'
                    , params: userdata
                }).success(function (msg) {
                    //console.log("All Products: " + JSON.stringify(msg.data));
                    callBack(msg);
                }).error(function (err) {
                    console.log(err);
                    callBack('error');
                });
            },
            makeOrder: function (data, callBack) {
                var shoppingList = [{
                            productID: 1,
                            productName : "Coke",
                            productBrand : "Coca-Cola",
                            productquantity: 3,
                            totalprice : 500
                        }, {
                            productID: 3,
                            productName : "Fanta",
                            productBrand : "Coca-Cola",
                            productquantity: 6,
                            totalprice : 700
                        }];

                $http({
                    method: 'POST'
                    , url: 'http://dev.sc-platform.api.reactive-solutions.xyz/api/v1/order/create/new'
                    , params: {
                        customer_id: 6650,
                        gross_total: 650,
                        discount : 0,
                        net_total : 1000,
                        supplier_id : 2,
                        shopping_list: shoppingList
                    }
                }).success(function (msg) {
                    console.log("Create order res: " + JSON.stringify(msg));
                    callBack(msg);
                }).error(function (err) {
                    console.log(err);
                    callBack('error');
                });
            }
        };
    }]);
