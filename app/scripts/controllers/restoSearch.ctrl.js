(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoSearchCtrl', restoSearchCtrl);
  
  restoSearchCtrl.$inject = ['$scope', 'locationApiService', 'commonApiService', 'restaurantApiService', '$state', '$localStorage', '$document', '$timeout', '$mdToast']

  function restoSearchCtrl ($scope, locationApiService, commonApiService, restaurantApiService, $state, $localStorage, $document, $timeout, $mdToast) {
    
    var resto = this
    resto.locationSuggestions = []
    resto.querySearch   = querySearch;
    resto.selectedItemChange = selectedItemChange;
    resto.searchTextChange   = searchTextChange;
    resto.searchRestos = searchRestos;
    
    self.simulateQuery = false;
    self.isDisabled    = false;
    
    self.init = function(){
      $localStorage.nearbyRestos = []
      
      locationApiService.getAllLocations('new', 10).then(function(res){
        resto.locationSuggestions = res.data.location_suggestions
        resto.allLocation        = loadAll();
      })
      
    }
    
    self.init()

    function querySearch (query) {
      var results = query ? loadAll().filter( createFilterFor(query) ) : loadAll(),
          deferred;
      if (resto.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      locationApiService.getAllLocations(text).then(function(response){
        resto.locationSuggestions = response.data.location_suggestions
      })
    }

    function selectedItemChange(item) {
     // nothing to call here, for future use
    }

    /**
     * Build locationlist
     */
    function loadAll() {
      return (resto.locationSuggestions)
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
    
    resto.getlocation = function(){
      resto.buttonState = true
      $timeout(function(){
            if(!$scope.locationGot){
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Hold on! sometimes it will take some time')
                  .position('top')
                  .hideDelay(3000)
              );
            }
          }, 5000)
          $timeout(function(){
            if(!$scope.locationGot){
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Sorry! can\'t get your location')
                  .position('top')
                  .hideDelay(5000)
              );
              resto.buttonState = false
            }
          }, 10000)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.$apply(function(){
            $scope.position = position;
            commonApiService.getGeoCode($scope.position.coords).then(function(response){
              resto.selectedItem = response.data.location
              resto.buttonState = false
              $scope.locationGot = true;
            })
          });
        }, null, {enableHighAccuracy: true});
      }
    }
    
    function searchRestos(locObj){
      resto.searchBtnActive = true;
      $localStorage.locationData = locObj
      var query = {"lat": locObj.latitude,
                   "lon": locObj.longitude}
      if(!resto.storeOffset){
        resto.storeOffset = 0
      }
      else{
        resto.storeOffset += 99
      }
//      The api returns maximum 20 results. But we need 99
      var newOffset = resto.storeOffset
      var count = 20
      for(var i=0; i<5; i++){
        newOffset = resto.storeOffset+(i*20)
        if(i >= 4){
          count = 19
        }
        
        restaurantApiService.searchForRestos(query, newOffset, count).then(function(res){
          if(count == 19)
            $state.go('home.restaurants')
        })
      }
    }
    
    
  } 
})();