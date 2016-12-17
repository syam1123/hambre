(function (){

  angular.module('hambreApp')
    .controller('homeCtrl', ['$scope', 'commonApiService', '$state', '$timeout', '$mdToast', function($scope, commonApiService, $state, $state, $timeout, $mdToast){

      var home = this;

      home.init = function(){
//        Nothing for now
      }
      home.init()

    }]);
    
})();