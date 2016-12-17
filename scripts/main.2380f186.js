angular.module("hambreApp",["ui.router","ngMaterial","ngStorage","oc.lazyLoad","ngMessages","720kb.tooltips","angularMoment","ngCookies","google-maps"]).config(["$locationProvider","$stateProvider","$urlRouterProvider","$localStorageProvider","$httpProvider",function(e,t,o,n,a){e.html5Mode(!0),o.otherwise("/search"),t.state("home",{url:"/",templateUrl:"views/home.tmpl.f153a093.html",controller:"homeCtrl",controllerAs:"home","abstract":!0}).state("home.find",{url:"search",templateUrl:"views/searchResto.tmpl.a62a1fca.html",controller:"restoSearchCtrl",controllerAs:"resto"}).state("home.restaurants",{url:"restaurants",templateUrl:"views/restaurents.tmpl.4ca98e4e.html",controller:"restoListCtrl",controllerAs:"list",resolve:{categoriesObj:["commonApiService",function(e){return e.getCategory().then(function(e){return e.data})}]}}).state("home.restaurantDetail",{url:"restaurants/:id",templateUrl:"views/restaurentDetail.tmpl.dfff6171.html",controller:"restoDetailCtrl",controllerAs:"detail",resolve:{RestaruantDetail:["restaurantApiService","$stateParams",function(e,t){return e.getRestoDetail(t.id).then(function(e){return e.data})}],ReviewObj:["restaurantApiService","$stateParams",function(e,t){return e.getReviews(t.id).then(function(e){return e.data})}]}}),n.setKeyPrefix("hambre-")}]).run(["amMoment","$state","$location","$rootScope","$localStorage","$cookies","HAMBREENV",function(e,t,o,n,a,r,i){n.baseUrl=i.BASE_URL,n.$apply(),n.$on("$locationChangeSuccess",function(){n.actualLocation=o.path()}),r.get("userkey")||r.put("userkey",i.USER_KEY)}]).config(["$httpProvider","HAMBREENV",function(e,t){e.defaults.headers.post.Accept="application/json, text/javascript",e.defaults.headers.post["Content-Type"]="application/json; charset=utf-8",e.defaults.headers.common.Accept="application/json, text/javascript",e.defaults.headers.common["Content-Type"]="application/json; charset=utf-8",e.defaults.headers.common["user-key"]=t.USER_KEY}]),function(){angular.module("hambreApp").controller("homeCtrl",["$scope","commonApiService","$state",function(e,t,o,o){var n=this;n.init=function(){},n.init(),n.getlocation=function(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(o){e.$apply(function(){e.position=o,t.getGeoCode(e.position.coords)})})}}])}(),function(){"use strict";function e(e,t,o,n,a,r,i){function s(e){var t,o=e?u().filter(p(e)):u();return g.simulateQuery?(t=$q.defer(),$timeout(function(){t.resolve(o)},1e3*Math.random(),!1),t.promise):o}function c(e){t.getAllLocations(e).then(function(e){g.locationSuggestions=e.data.location_suggestions})}function l(e){}function u(){return g.locationSuggestions}function p(e){var t=angular.lowercase(e);return function(e){return 0===e.value.indexOf(t)}}function d(e){g.searchBtnActive=!0,r.locationData=e;var t={lat:e.latitude,lon:e.longitude};g.storeOffset?g.storeOffset+=99:g.storeOffset=0;for(var o=g.storeOffset,i=20,s=0;s<5;s++)o=g.storeOffset+20*s,s>=4&&(i=19),n.searchForRestos(t,o,i).then(function(e){19==i&&a.go("home.restaurants")})}var g=this;g.locationSuggestions=[],g.states=u(),g.querySearch=s,g.selectedItemChange=l,g.searchTextChange=c,g.searchRestos=d,self.simulateQuery=!1,self.isDisabled=!1,self.init=function(){r.nearbyRestos=[]},self.init(),g.getlocation=function(){g.buttonState=!0,navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(t){e.$apply(function(){e.position=t,o.getGeoCode(e.position.coords).then(function(e){g.selectedItem=e.data.location,g.buttonState=!1})})})}}angular.module("hambreApp").controller("restoSearchCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage","$document"]}(),function(){"use strict";function e(e,t,o,n,a,r,i){function s(){return d.restaurants}function c(e){a.go("home.restaurantDetail",{id:e})}function l(e){d.restaurantsToShow=[],d.showLoader=!0;var t=!0;d.storeOffset?d.storeOffset+=99:d.storeOffset=0;for(var o=d.storeOffset,a=20,r=0;r<5;r++)o=d.storeOffset+20*r,r>=4&&(a=19),n.searchForRestos(e,o,a,t).then(function(e){d.restaurantsToShow.push.apply(d.restaurantsToShow,e.data.restaurants),d.showLoader=!1})}function u(e){d.selectedCategories.indexOf(e)<0?d.selectedCategories.push(e):d.selectedCategories.splice(d.selectedCategories.indexOf(e),1);var t={category:d.selectedCategories.join(","),lat:r.locationData.latitude,lon:r.locationData.longitude};l(t)}function p(){var e="";d.choosedCategories.length>0&&(e=d.choosedCategories.join(","));var t={category:d.choosedCategories.join(","),lat:r.locationData.latitude,lon:r.locationData.longitude};l(t)}var d=this;d.getRestaurantsToShow=s,d.getMoreDetails=c,d.showSpecificCategory=u,d.searchCategory=p,d.init=function(){d.restaurants=r.nearbyRestos,d.locatiosData=r.locationData,d.restaurantsToShow=d.getRestaurantsToShow(),d.noImage="http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png",d.categoriesObj=i.categories,d.selectedCategories=[]},d.init()}angular.module("hambreApp").controller("restoListCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage","categoriesObj"]}(),function(){"use strict";function e(e,t,o,n,a,r,i,s,c){var l=this;l.restoData=i,l.noImage="http://balifoodandfun.com/wp-content/themes/balifoodandfun/images/no-image-available.png",l.init=function(){l.userLocation=r.locationData,l.storeLocation=l.restoData.location,l.reviews=c.user_reviews,window.scrollTo(0,0)},l.init(),l.map={control:{},center:{latitude:l.userLocation.latitude,longitude:l.userLocation.longitude},zoom:14},l.marker={center:{latitude:l.userLocation.latitude,longitude:l.userLocation.longitude}};var u=new google.maps.DirectionsRenderer,p=new google.maps.DirectionsService;new google.maps.Geocoder;l.directions={origin:l.userLocation.title,destination:l.storeLocation.address},l.getDirections=function(){var e={origin:new google.maps.LatLng(l.userLocation.latitude,l.userLocation.longitude),destination:new google.maps.LatLng(l.storeLocation.latitude,l.storeLocation.longitude),travelMode:google.maps.DirectionsTravelMode.DRIVING};p.route(e,function(e,t){t===google.maps.DirectionsStatus.OK?(u.setDirections(e),u.setMap(l.map.control.getGMap()),u.setPanel(document.getElementById("directionsList")),l.directions.showList=!0):s.show(s.simple().textContent("Sorry! direction is unavailable").position("top").hideDelay(5e3))})},l.getDirections()}angular.module("hambreApp").controller("restoDetailCtrl",e),e.$inject=["$scope","locationApiService","commonApiService","restaurantApiService","$state","$localStorage","RestaruantDetail","$mdToast","ReviewObj"]}(),function(){return angular.module("hambreApp").constant("HAMBREENV",{API_ENDPOINT:"https://developers.zomato.com/",USER_KEY:"076ab577bbb0b2476c8387f8dde1b466",BASE_URL:"https://syam1123.github.io/hambre/"})}(),function(){"use strict";function e(e,t,o,n){function a(o){var n=t.defer();return e({url:r+i.locations,method:"GET",params:{query:o,count:10}}).then(function(e){n.resolve(e)},function(e){n.resolve(e)}),n.promise}var r=n.API_ENDPOINT,i={locations:"api/v2.1/locations",locationDetail:"api/v2.1/location_details"};return{getAllLocations:a}}angular.module("hambreApp").factory("locationApiService",e),e.$inject=["$http","$q","$window","HAMBREENV"]}(),function(){"use strict";function e(e,t,o,n,a){function r(o,n,r,i){var s=t.defer();return e({url:c+l.search,method:"GET",params:{lat:o.lat,lon:o.lon,cuisines:o.cuisines,establishment_type:o.establishment_type,collection_id:o.collection_id,category:o.category,start:n,count:r}}).then(function(e){s.resolve(e),i||a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){s.resolve(e)}),s.promise}function i(o,n,r){var i=n?n:0,s=r?r:20,u=t.defer();return e({url:c+l.reviews,method:"GET",params:{res_id:o,start:i,count:s}}).then(function(e){u.resolve(e),a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){u.resolve(e)}),u.promise}function s(o){var n=t.defer();return e({url:c+l.restaurant,method:"GET",params:{res_id:o}}).then(function(e){n.resolve(e),a.nearbyRestos.push.apply(a.nearbyRestos,e.data.restaurants)},function(e){n.resolve(e)}),n.promise}var c=n.API_ENDPOINT,l={search:"api/v2.1/search",reviews:"api/v2.1/reviews",restaurant:"api/v2.1/restaurant",dailyMenu:"api/v2.1/dailymenu"};return{searchForRestos:r,getRestoDetail:s,getReviews:i}}angular.module("hambreApp").factory("restaurantApiService",e),e.$inject=["$http","$q","$window","HAMBREENV","$localStorage"]}(),function(){"use strict";function e(e,t,o,n,a){function r(){var o=t.defer();return e({url:l+u.category,method:"GET"}).then(function(e){o.resolve(e)},function(e){o.resolve(e)}),o.promise}function i(o,n){var a=t.defer();return e({url:l+u.collections,method:"GET",params:{lat:o.latitude,lon:o.longitude,count:n}}).then(function(e){a.resolve(e)},function(e){a.resolve(e)}),a.promise}function s(o){var n=t.defer();return e({url:l+u.geoCode,method:"GET",params:{lat:o.latitude,lon:o.longitude}}).then(function(e){n.resolve(e)},function(e){n.resolve(e)}),n.promise}function c(o){var n=t.defer();return e({url:l+u.geoCode,method:"GET",params:{lat:o.latitude,lon:o.longitude}}).then(function(e){n.resolve(e)},function(e){n.resolve(e)}),n.promise}var l=n.API_ENDPOINT,u={category:"api/v2.1/categories",citis:"api/v2.1/cities",collections:"api/v2.1/collections",cuisines:"api/v2.1/cuisines",establishments:"api/v2.1/establishments",geoCode:"api/v2.1/geocode"};return{getCategory:r,getGeoCode:s,getCollections:i,getCuisines:c}}angular.module("hambreApp").factory("commonApiService",e),e.$inject=["$http","$q","$window","HAMBREENV","$localStorage"]}();