(function () {
  'use strict';
  angular
      .module('hambreApp')
      .controller('restoDetailCtrl', restoDetailCtrl);
  
  restoDetailCtrl.$inject = ['$scope', 'locationApiService', 'commonApiService', 'restaurantApiService', '$state', '$localStorage', 'RestaruantDetail', '$mdToast', 'ReviewObj']
  
  function restoDetailCtrl($scope, locationApiService, commonApiService, restaurantApiService, $state, $localStorage, RestaruantDetail, $mdToast, ReviewObj){
    
    var detail = this
    detail.restoData = RestaruantDetail
    detail.noImage = 'http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png'
    
    detail.init = function(){
      if(!RestaruantDetail){
        $state.go('home.restaurants')
        return;
      }
      detail.userLocation = $localStorage.locationData
      detail.storeLocation = detail.restoData.location
      detail.reviews = ReviewObj.user_reviews
      window.scrollTo(0, 0);
    }
    detail.init()
    
    // map object
    detail.map = {
      control: {},
      center: {
        latitude: detail.userLocation.latitude,
        longitude: detail.userLocation.longitude
      },
      zoom: 14
    };

    // marker object
    detail.marker = {
      center: {
        latitude: detail.userLocation.latitude,
        longitude: detail.userLocation.longitude
      }
    }

    // instantiate google map objects for directions
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();

    // directions object -- with defaults
    detail.directions = {
      origin: detail.userLocation.title,
      destination: detail.storeLocation.address
    }

    // get directions using google maps api
    detail.getDirections = function () {
      var request = {
        origin: new google.maps.LatLng(detail.userLocation.latitude, detail.userLocation.longitude),
        destination: new google.maps.LatLng(detail.storeLocation.latitude, detail.storeLocation.longitude),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(detail.map.control.getGMap());
          directionsDisplay.setPanel(document.getElementById('directionsList'));
          detail.directions.showList = true;
        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Sorry! direction is unavailable')
              .position('top')
              .hideDelay(5000)
          );
        }
      });
    }
    
    detail.getDirections()
    
  }
  
})();