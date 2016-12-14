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
      searchForRestos: searchForRestos,
      getRestoDetail: getRestoDetail,
      getReviews: getReviews
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
    
    function getReviews(id, offset=0, count=20){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.reviews,
        method: 'GET',
        params: {
          res_id: id,
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
    
    function getRestoDetail(id){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.restaurant,
        method: 'GET',
        params: {
          res_id: id
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