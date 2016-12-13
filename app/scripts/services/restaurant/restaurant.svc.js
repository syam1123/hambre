(function () {
  'use strict';

  angular.module('hambreApp')
    .factory('restaurantApiService', restaurantApiService)

  restaurantApiService.$inject = ['$http', '$q', '$window', 'HAMBREENV']

  function restaurantApiService($http, $q, $window, HAMBREENV) {
    var API_ENDPOINT = HAMBREENV.API_ENDPOINT,
        API_PATH = {
          search: 'api/v2.1/search',
          reviews: 'api/v2.1/reviews',
          restaurant: 'api/v2.1/restaurant',
          dailyMenu: 'api/v2.1/dailymenu'
        }
    return{
      searForResto : searForResto
    }
    
    function getCategory(){
      console.log("get category");
    } 
  }
})();