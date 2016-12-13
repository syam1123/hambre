(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoSearchCtrl', restoSearchCtrl);
  
  restoSearchCtrl.$inject = ['$scope', '$timeout', '$q', '$log', 'locationApiService']

  function restoSearchCtrl ($scope, $timeout, $q, $log, locationApiService) {
    
    var resto = this
    resto.locationSuggestions = []
    resto.states        = loadAll();
    resto.querySearch   = querySearch;
    resto.selectedItemChange = selectedItemChange;
    resto.searchTextChange   = searchTextChange;
    
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
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      console.log("resto.locationSuggestions in loadall", resto.locationSuggestions);
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
  } 
})();