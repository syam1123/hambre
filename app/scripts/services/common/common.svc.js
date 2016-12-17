(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('commonApiService', commonApiService)

  commonApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV', '$localStorage', '$mdToast']

  function commonApiService($http, $q, $window, HAMBREENV, $localStorage, $mdToast) {
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
    
//    service to get all category list nearby user location
    
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
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sorry! Unable to show categories')
            .position('top')
            .hideDelay(5000)
        );
      })

      return deferred.promise;
    } 
    
//    get all collections nearby location
    
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
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sorry! Unable to get the collections near your place')
            .position('top')
            .hideDelay(5000)
        );
      })

      return deferred.promise;
    }
    
//    getting location details from longitude and latitude vaues
    
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
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sorry! something went wrong. please try again')
            .position('top')
            .hideDelay(5000)
        );
      })

      return deferred.promise;
    }
    
//    getting cuisins details nearby location
    
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
        $mdToast.show(
          $mdToast.simple()
            .textContent('Sorry! Unable to get the cuisins near your place')
            .position('top')
            .hideDelay(5000)
        );
      })

      return deferred.promise;
    }
  }
})();