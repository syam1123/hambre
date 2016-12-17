(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoListCtrl', restoListCtrl);
  
  restoListCtrl.$inject = ['$scope', 'locationApiService', 'commonApiService', 'restaurantApiService', '$state', '$localStorage', 'categoriesObj', 'collectionObj']
  
  function restoListCtrl($scope, locationApiService, commonApiService, restaurantApiService, $state, $localStorage, categoriesObj, collectionObj){
    
    var list = this
    
//    Initialise all functions here to new variable so that to improve minifying/uglifying js
    
    list.getRestaurantsToShow = getRestaurantsToShow
    list.getMoreDetails = getMoreDetails
    list.showSpecificCategory = showSpecificCategory
    list.searchCategory = searchCategory
    
    list.init = function(){
      
//      initialising variables that can be used for rendering
      
      list.restaurants = $localStorage.nearbyRestos
      list.locatiosData = $localStorage.locationData
      list.restaurantsToShow = list.getRestaurantsToShow()
      list.noImage = 'http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png'
      list.categoriesObj = categoriesObj.categories
      list.trendingCollections = collectionObj.collections
      list.selectedCategories = []
    }
    list.init()
    
    function getRestaurantsToShow(){
      
//      assign variable through function returns rather than using var a = var b. Javascript binding issue
      
      return (list.restaurants)
    }
    
    function getMoreDetails(id){
      $state.go('home.restaurantDetail', {'id': id})
    }
    
    function getAllRestorants(choice){
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
        
        restaurantApiService.searchForRestos(choice, newOffset, count, filter).then(function(res){
          list.restaurantsToShow.push.apply(list.restaurantsToShow, res.data.restaurants)
          list.showLoader = false
        })
      }
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
      
      getAllRestorants(categories)
      
    }
    
    function searchCategory(){
      var categoryIds = ''
      if(list.choosedCategories.length > 0){
        categoryIds = list.choosedCategories.join(',')
      }
      var categories = {'category': list.choosedCategories.join(','),
                        'lat': $localStorage.locationData.latitude,
                        'lon': $localStorage.locationData.longitude}
      getAllRestorants(categories)
      
    }
  }
  
})();