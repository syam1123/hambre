(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('restaurantApiService', restaurantApiService)

  restaurantApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV', '$localStorage']

  function restaurantApiService($http, $q, $window, HAMBREENV, $localStorage) {
    var API_ENDPOINT = HAMBREENV.API_ENDPOINT,
        APIPATH = {
          search: 'api/v2.1/search',
          reviews: 'api/v2.1/reviews',
          restaurant: 'api/v2.1/restaurant',
          dailyMenu: 'api/v2.1/dailymenu'
        }
    return{
      searchForRestos: searchForRestos
    }
    
    function searchForRestos(locObj, offset, count){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.search,
        method: 'GET',
        params: {
          lat: locObj.latitude,
          lon: locObj.longitude,
          start: offset,
          count: count
        }
      })
      .then(function (data) {
        deferred.resolve(data);
        console.log("data in promise", data);
        $localStorage.nearbyRestos.push.apply($localStorage.nearbyRestos, data.data.restaurants)
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    } 
  }
})();