(function (){

  angular.module('hambreApp')
    .controller('homeCtrl', ['$scope', 'commonApiService', '$state', function($scope, commonApiService, $state){

      var home = this;

      home.init = function(){
//        Nothing for now
      }
      home.init()

      home.getlocation = function(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            $scope.$apply(function(){
              $scope.position = position;
              commonApiService.getGeoCode($scope.position.coords)
            });
          });
        }
      }

    }]);
    
})();