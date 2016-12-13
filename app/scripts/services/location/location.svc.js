(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('locationApiService', locationApiService)

  locationApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV']

  function locationApiService($http, $q, $window, HAMBREENV) {
    var API_ENDPOINT = HAMBREENV.API_ENDPOINT,
        API_PATH = {
          location: 'api/v2.1/locations',
          locationDetail: 'api/v2.1/location_details'
        }
    return{
      getCategory : getCategory
    }
    
    function getCategory(){
      console.log("get category");
    } 
  }
})();