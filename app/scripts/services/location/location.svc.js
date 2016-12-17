(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('locationApiService', locationApiService)

  locationApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV', '$mdToast']

  function locationApiService($http, $q, $window, HAMBREENV, $mdToast) {
    var API_ENDPOINT = HAMBREENV.API_ENDPOINT,
        APIPATH = {
          locations: 'api/v2.1/locations',
          locationDetail: 'api/v2.1/location_details'
        }
    return{
      getAllLocations : getAllLocations
    }
    
    function getAllLocations(query){
      var deferred = $q.defer();

      $http({
          url: API_ENDPOINT + APIPATH.locations,
          method: 'GET',
          params: {
            query: query,
            count: 10
          }
        })
        .then(function (data) {
          deferred.resolve(data);
        },function(data){
          deferred.resolve(data);
          $mdToast.show(
            $mdToast.simple()
              .textContent('Sorry! Our server is down, please try again later')
              .position('top')
              .hideDelay(5000)
          );
        })

      return deferred.promise;
    } 
  }
})();