(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoListCtrl', restoListCtrl);
  
  restoListCtrl.$inject = ['$scope', 'locationApiService', 'commonApiService', 'restaurantApiService', '$state', '$localStorage']
  
  function restoListCtrl($scope, locationApiService, commonApiService, restaurantApiService, $state, $localStorage){
    
    var list = this
    list.getRestaurantsToShow = getRestaurantsToShow
    list.getMoreDetails = getMoreDetails
    
    list.init = function(){
      list.restaurants = $localStorage.nearbyRestos
      list.locatiosData = $localStorage.locationData
      console.log("the restaurents", list.restaurants);
      list.restaurantsToShow = list.getRestaurantsToShow()
      list.noImage = 'http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png'
    }
    list.init()
    
    function getRestaurantsToShow(){
      return (list.restaurants)
    }
    
    function getMoreDetails(id){
      $state.go('home.restaurantDetail', {'id': id})
    }
  }
  
})();