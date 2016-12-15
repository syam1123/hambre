(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('commonApiService', commonApiService)

  commonApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV', '$localStorage']

  function commonApiService($http, $q, $window, HAMBREENV, $localStorage) {
    var API_ENDPOINT = HAMBREENV.API_ENDPOINT,
        APIPATH = {
          category: 'api/v2.1/categories',
          citis: 'api/v2.1/cities',
          collections: 'api/v2.1/collections',
          cuisines: 'api/v2.1/cuisines',
          establishments: 'api/v2.1/establishments',
          geoCode: 'api/v2.1/geocode'
        }
    return{
      getCategory : getCategory,
      getGeoCode: getGeoCode,
      getCollections: getCollections,
      getCuisines: getCuisines
    }
    
    function getCategory(){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.category,
        method: 'GET'
      })
      .then(function (data) {
        deferred.resolve(data);
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    } 
    
    function getCollections(locObj, count){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.collections,
        method: 'GET',
        params: {
          lat: locObj.latitude,
          lon: locObj.longitude,
          count: count
        }
      })
      .then(function (data) {
        deferred.resolve(data);
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    }
    
    function getGeoCode(locObj){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.geoCode,
        method: 'GET',
        params: {
          lat: locObj.latitude,
          lon: locObj.longitude
        }
      })
      .then(function (data) {
        deferred.resolve(data);
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    }
    
    function getCuisines(locObj){
      var deferred = $q.defer();

      $http({
        url: API_ENDPOINT + APIPATH.geoCode,
        method: 'GET',
        params: {
          lat: locObj.latitude,
          lon: locObj.longitude
        }
      })
      .then(function (data) {
        deferred.resolve(data);
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    }
  }
})();