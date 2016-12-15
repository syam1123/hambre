angular.module("hambreApp",["ui.router","ngMaterial","ngStorage","oc.lazyLoad","ngMessages","720kb.tooltips","angularMoment","ngCookies","google-maps"]).config(["$locationProvider","$stateProvider","$urlRouterProvider","$localStorageProvider","$httpProvider",function(e,t,o,n,a){e.html5Mode(!0),o.otherwise("/search"),t.state("home",{url:"/",templateUrl:"views/home.tmpl.html",controller:"homeCtrl",controllerAs:"home","abstract":!0}).state("home.find",{url:"search",templateUrl:"views/searchResto.tmpl.html",controller:"restoSearchCtrl",controllerAs:"resto"}).state("home.restaurants",{url:"restaurants",templateUrl:"views/restaurents.tmpl.html",controller:"restoListCtrl",controllerAs:"list"}).state("home.restaurantDetail",{url:"restaurants/:id",templateUrl:"views/restaurentDetail.tmpl.html",controller:"restoDetailCtrl",controllerAs:"detail",resolve:{RestaruantDetail:["restaurantApiService","$stateParams",function(e,t){return e.getRestoDetail(t.id).then(function(e){return console.log("restaurent details",e),e.data})}],ReviewObj:["restaurantApiService","$stateParams",function(e,t){return e.getReviews(t.id).then(function(e){return console.log("restaurent details",e),e.data})}]}}),n.setKeyPrefix("hambre-")}]).run(["amMoment","$state","$location","$rootScope","$localStorage","$cookies","HAMBREENV",function(e,t,o,n,a,r,i){function s(){var e=(new Date).getTime(),t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var o=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?o:3&o|8).toString(16)});return t}e.changeLocale("en_au");var c=navigator.userAgent||navigator.vendor||window.opera;(c.match(/iPhone/i)||c.match(/Android/i))&&o.path("/m"),n.$on("$locationChangeSuccess",function(){n.actualLocation=o.path()}),r.get("sessionid")||r.put("sessionid",s()),r.get("userkey")||r.put("userkey",i.USER_KEY)}]).config(["$httpProvider","HAMBREENV",function(e,t){e.defaults.headers.post.Accept="application/json, text/javascript",e.defaults.headers.post["Content-Type"]="application/json; charset=utf-8",e.defaults.headers.common.Accept="application/json, text/javascript",e.defaults.headers.common["Content-Type"]="application/json; charset=utf-8",e.defaults.headers.common["user-key"]=t.USER_KEY}]),function(){angular.module("hambreApp").controller("homeCtrl",["$scope","commonApiService","$state",function(e,t,o){var n=this;n.init=function(){t.getCategory()},n.init(),n.getlocation=function(){navigator.geolocation&&(console.log("clicked"),navigator.geolocation.getCurrentPosition(function(o){e.$apply(function(){e.position=o,console.log("location",e.position),t.getGeoCode(e.position.coords)})}))}}])}(),function(){"use strict";function e(e,t,o,n,a,r,i){function s(e){var t,o=e?u().filter(p(e)):u();return d.simulateQuery?(t=$q.defer(),$timeout(function(){t.resolve(o)},1e3*Math.random(),!1),t.promise):o}function c(e){t.getAllLocations(e).then(function(e){d.locationSuggestions=e.data.location_suggestions})}function l(e){console.log("Item changed to "+JSON.stringify(e))}function u(){return d.locationSuggestions}function p(e){var t=angular.lowercase(e);return function(e){return 0===e.value.indexOf(t)}}function g(e){r.locationData=e,d.storeOffset?d.storeOffset+=99:d.storeOffset=0;for(var t=d.storeOffset,o=20,i=0;i<5;i++)t=d.storeOffset+20*i,i>=4&&(o=19),n.searchForRestos(e,t,o).then(function(e){console.log("all restos",e.data),19==o&&a.go("home.restaurants")})}var d=this;d.locationSuggestions=[],d.states=u(),d.querySearch=s,d.selectedItemChange=l,d.searchTextChange=c,d.searchRestos=g,self.simulateQuery=!1,self.isDisabled=!1,self.init=function(){r.nearbyRestos=[]},self.init(),d.getlocation=function(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(t){e.$apply(function(){e.position=t,console.log("location",e.position),o.getGeoCode(e.position.coords).then(function(e){d.selectedItem=e.data.location})})})}}angular.module("hambreApp").controller("restoSearchCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage","$document"]}(),function(){"use strict";function e(e,t,o,n,a,r){function i(){return c.restaurants}function s(e){a.go("home.restaurantDetail",{id:e})}var c=this;c.getRestaurantsToShow=i,c.getMoreDetails=s,c.init=function(){c.restaurants=r.nearbyRestos,c.locatiosData=r.locationData,console.log("the restaurents",c.restaurants),c.restaurantsToShow=c.getRestaurantsToShow(),c.noImage="http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png"},c.init()}angular.module("hambreApp").controller("restoListCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage"]}(),function(){"use strict";function e(e,t,o,n,a,r,i,s,c){var l=this;l.restoData=i,l.noImage="http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png",l.init=function(){l.userLocation=r.locationData,l.storeLocation=l.restoData.location,l.reviews=c.user_reviews},l.init(),l.map={control:{},center:{latitude:l.userLocation.latitude,longitude:l.userLocation.longitude},zoom:14},l.marker={center:{latitude:l.userLocation.latitude,longitude:l.userLocation.longitude}};var u=new google.maps.DirectionsRenderer,p=new google.maps.DirectionsService;new google.maps.Geocoder;l.directions={origin:l.userLocation.title,destination:l.storeLocation.address},l.getDirections=function(){var e={origin:new google.maps.LatLng(l.userLocation.latitude,l.userLocation.longitude),destination:new google.maps.LatLng(l.storeLocation.latitude,l.storeLocation.longitude),travelMode:google.maps.DirectionsTravelMode.DRIVING};p.route(e,function(e,t){t===google.maps.DirectionsStatus.OK?(u.setDirections(e),u.setMap(l.map.control.getGMap()),u.setPanel(document.getElementById("directionsList")),l.directions.showList=!0):s.show(s.simple().textContent("Sorry! direction is unavailable").position("top").hideDelay(5e3))})},l.getDirections()}angular.module("hambreApp").controller("restoDetailCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage","RestaruantDetail","$mdToast","ReviewObj"]}(),function(){return angular.module("hambreApp").constant("HAMBREENV",{API_ENDPOINT:"https://developers.zomato.com/",USER_KEY:"076ab577bbb0b2476c8387f8dde1b466"})}(),function(){"use strict";function e(e,t,o,n){function a(o){var n=t.defer();return e({url:r+i.locations,method:"GET",params:{query:o}}).then(function(e){n.resolve(e)},function(e){n.resolve(e)}),n.promise}var r=n.API_ENDPOINT,i={locations:"api/v2.1/locations",locationDetail:"api/v2.1/location_details"};return{getAllLocations:a}}angular.module("hambreApp").factory("locationApiService",e),e.$inject=["$http","$q","$window","HAMBREENV"]}(),function(){"use strict";function e(e,t,o,n,a){function r(o,n,r){var i=t.defer();return e({url:c+l.search,method:"GET",params:{lat:o.latitude,lon:o.longitude,start:n,count:r}}).then(function(e){i.resolve(e),console.log("data in promise",e),a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){i.resolve(e)}),i.promise}function i(o,n,r){var i=n?n:0,s=r?r:0,u=t.defer();return e({url:c+l.reviews,method:"GET",params:{res_id:o,start:i,count:s}}).then(function(e){u.resolve(e),console.log("data in promise",e),a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){u.resolve(e)}),u.promise}function s(o){var n=t.defer();return e({url:c+l.restaurant,method:"GET",params:{res_id:o}}).then(function(e){n.resolve(e),console.log("data in promise",e),a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){n.resolve(e)}),n.promise}var c=n.API_ENDPOINT,l={search:"api/v2.1/search",reviews:"api/v2.1/reviews",restaurant:"api/v2.1/restaurant",dailyMenu:"api/v2.1/dailymenu"};return{searchForRestos:r,getRestoDetail:s,getReviews:i}}angular.module("hambreApp").factory("restaurantApiService",e),e.$inject=["$http","$q","$window","HAMBREENV","$localStorage"]}(),function(){"use strict";function e(e,t,o,n,a){function r(){console.log("get category")}function i(o){var n=t.defer();return e({url:s+c.geoCode,method:"GET",params:{lat:o.latitude,lon:o.longitude}}).then(function(e){n.resolve(e)},function(e){n.resolve(e)}),n.promise}var s=n.API_ENDPOINT,c={category:"api/v2.1/categories",citis:"api/v2.1/cities",collections:"api/v2.1/collections",cuisines:"api/v2.1/cuisines",establishments:"api/v2.1/establishments",geoCode:"api/v2.1/geocode"};return{getCategory:r,getGeoCode:i}}angular.module("hambreApp").factory("commonApiService",e),e.$inject=["$http","$q","$window","HAMBREENV","$localStorage"]}();