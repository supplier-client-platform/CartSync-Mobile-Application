angular.module('app.myCartController', [])

.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,$restClient) {

 

    $scope.checkout=function(){
     $restClient.makeOrder(555,function(msg){
        console.log(JSON.stringify(msg));
     });
    };



})