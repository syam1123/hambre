(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoListCtrl', restoListCtrl);
  
  restoListCtrl.$inject = ['$scope', 'locationApiService', 'commonApiService', 'restaurantApiService', '$state', '$localStorage', 'categoriesObj']
  
  function restoListCtrl($scope, locationApiService, commonApiService, restaurantApiService, $state, $localStorage, categoriesObj){
    
    var list = this
    list.getRestaurantsToShow = getRestaurantsToShow
    list.getMoreDetails = getMoreDetails
    list.showSpecificCategory = showSpecificCategory
    
    list.init = function(){
      list.restaurants = $localStorage.nearbyRestos
      list.locatiosData = $localStorage.locationData
      list.restaurantsToShow = list.getRestaurantsToShow()
      list.noImage = 'http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png'
      list.categoriesObj = categoriesObj.categories
      list.selectedCategories = []
    }
    list.init()
    
    function getRestaurantsToShow(){
      return (list.restaurants)
    }
    
    function getMoreDetails(id){
      $state.go('home.restaurantDetail', {'id': id})
    }
    
    function showSpecificCategory(id){
      
      if(list.selectedCategories.indexOf(id) < 0){
        list.selectedCategories.push(id)
      }
      else{
        list.selectedCategories.splice(list.selectedCategories.indexOf(id), 1)
      }
      var categories = {'category': list.selectedCategories.join(','),
                        'lat': $localStorage.locationData.latitude,
                        'lon': $localStorage.locationData.longitude}
      
      list.restaurantsToShow = []
      list.showLoader = true
      var filter = true
      
      if(!list.storeOffset){
        list.storeOffset = 0
      }
      else{
        list.storeOffset += 99
      }
//      The api returns maximum 20 results. But we need 99
      var newOffset = list.storeOffset
      var count = 20
      for(var i=0; i<5; i++){
        newOffset = list.storeOffset+(i*20)
        if(i >= 4){
          count = 19
        }
        
        restaurantApiService.searchForRestos(categories, newOffset, count, filter).then(function(res){
          list.restaurantsToShow.push.apply(list.restaurantsToShow, res.data.restaurants)
          list.showLoader = false
        })
      }
      
    }
  }
  
})();