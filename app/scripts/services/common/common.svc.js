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
      getGeoCode: getGeoCode
    }
    
    function getCategory(){
      console.log("get category");
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
        $localStorage.localData = data
      },function(data){
        deferred.resolve(data);
      })

      return deferred.promise;
    }
  }
})();