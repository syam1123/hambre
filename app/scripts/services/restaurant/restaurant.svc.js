(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('restaurantApiService', restaurantApiService)

  restaurantApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV', '$localStorage', '$mdToast']

  function restaurantApiService($http, $q, $window, HAMBREENV, $localStorage, $mdToast) {
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
    
//    function to search all restaurants in a location
    
    function searchForRestos(locObj, offset, count, filter){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.search,
        method: 'GET',
        params: {
          lat: locObj.lat,
          lon: locObj.lon,
          cuisines: locObj.cuisines,
          establishment_type: locObj.establishment_type,
          collection_id: locObj.collection_id,
          category: locObj.category,
          start: offset,
          count: count
        }
      })
      .then(function (data) {
        deferred.resolve(data);
        if(!filter){
          $localStorage.nearbyRestos.push.apply($localStorage.nearbyRestos, data.data.restaurants)
        }
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
    
//    function to get all reviews about a restauran
    
    function getReviews(id, offset, count){
      var offsetVal = offset? offset: 0
      var totalCount = count? count: 20
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.reviews,
        method: 'GET',
        params: {
          res_id: id,
          start: offsetVal,
          count: totalCount
        }
      })
      .then(function (data) {
        deferred.resolve(data);
        $localStorage.nearbyRestos.push.apply($localStorage.nearbyRestos, data.data.restaurants)
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
    
//    function to get details about a restaurant
    
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
        $localStorage.nearbyRestos.push.apply($localStorage.nearbyRestos, data.data.restaurants)
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