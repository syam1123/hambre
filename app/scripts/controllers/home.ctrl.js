(function (){

  angular.module('hambreApp')
    .controller('homeCtrl', ['$scope', 'commonApiService', '$state', '$timeout', '$mdToast', function($scope, commonApiService, $state, $state, $timeout, $mdToast){

      var home = this;

      home.init = function(){
//        Nothing for now
//        Currently home state is abstracted. Nothing more functionalities.
//        eventually will add search field in header
      }
      home.init()

    }]);
    
})();