(function (){

  angular.module('hambreApp')
    .controller('homeCtrl', ['$scope', 'commonApiService', '$state', function($scope, commonApiService, $state){

      var home = this;

      home.init = function(){
        commonApiService.getCategory()
      }
      home.init()

      home.getlocation = function(){
        if (navigator.geolocation) {
          console.log("clicked");
          navigator.geolocation.getCurrentPosition(function(position){
            $scope.$apply(function(){
              $scope.position = position;
              console.log("location", $scope.position);
              commonApiService.getGeoCode($scope.position.coords)
            });
          });
        }
      }

    }]);
    
})();