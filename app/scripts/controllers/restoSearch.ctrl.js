(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoSearchCtrl', restoSearchCtrl);
  
  restoSearchCtrl.$inject = ['$scope', '$timeout', '$q', '$log', 'locationApiService', 'commonApiService', 'restaurantApiService']

  function restoSearchCtrl ($scope, $timeout, $q, $log, locationApiService, commonApiService, restaurantApiService) {
    
    var resto = this
    resto.locationSuggestions = []
    resto.states        = loadAll();
    resto.querySearch   = querySearch;
    resto.selectedItemChange = selectedItemChange;
    resto.searchTextChange   = searchTextChange;
    resto.searchRestos = searchRestos;
    
    self.simulateQuery = false;
    self.isDisabled    = false;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
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
      $log.info('Item changed to ' + JSON.stringify(item));
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
      if (navigator.geolocation) {
        console.log("clicked");
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.$apply(function(){
            $scope.position = position;
            console.log("location", $scope.position);
            commonApiService.getGeoCode($scope.position.coords).then(function(response){
              resto.selectedItem = response.data.location
            })
          });
        });
      }
    }
    
    function searchRestos(locObj){
      console.log("locObj", locObj);
      if(!resto.storeOffset){
        resto.storeOffset = 0
      }
      else{
        resto.storeOffset += 20
      }
      restaurantApiService.searchForRestos(locObj, resto.storeOffset).then(function(res){
        console.log("all restos", res.data);
      })
    }
  } 
})();