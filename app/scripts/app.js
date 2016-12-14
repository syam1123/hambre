angular
  .module('hambreApp', [
    'ui.router',
    'ngMaterial',
    'ngStorage',
    'oc.lazyLoad',
    'ngMessages',
    '720kb.tooltips',
    'angularMoment',
    'ngCookies',
    'google-maps'
  ])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$localStorageProvider', '$httpProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, $localStorageProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider
      .otherwise('/search');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.tmpl.html',
        controller: 'homeCtrl',
        controllerAs: 'home',
        abstract: true
      })
      .state('home.find', {
        url: 'search',
        templateUrl: 'views/searchResto.tmpl.html',
        controller: 'restoSearchCtrl',
        controllerAs: 'resto'
      })
      .state('home.restaurants', {
        url: 'restaurants',
        templateUrl: 'views/restaurents.tmpl.html',
        controller: 'restoListCtrl',
        controllerAs: 'list'
      })
      .state('home.restaurantDetail', {
        url: 'restaurants/:id',
        templateUrl: 'views/restaurentDetail.tmpl.html',
        controller: 'restoDetailCtrl',
        controllerAs: 'detail',
        resolve: {
          RestaruantDetail:['restaurantApiService', '$stateParams', function (restaurantApiService, $stateParams) {
            return restaurantApiService.getRestoDetail($stateParams.id).then(function(res) {
                console.log("restaurent details", res);
                return res.data
              })
          }],
          ReviewObj:['restaurantApiService', '$stateParams', function (restaurantApiService, $stateParams) {
            return restaurantApiService.getReviews($stateParams.id).then(function(res) {
                console.log("restaurent details", res);
                return res.data
              })
          }]
        }
      })
    
    $localStorageProvider.setKeyPrefix('hambre-')
    
  }])
  .run(['amMoment', '$state', '$location', '$rootScope', '$localStorage', '$cookies', 'HAMBREENV', function (amMoment, $state, $location, $rootScope, $localStorage, $cookies, HAMBREENV) {
    amMoment.changeLocale('en_au');
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPhone/i) || userAgent.match(/Android/i)) {
      $location.path('/m')
    }

    $rootScope.$on('$locationChangeSuccess', function () {
      $rootScope.actualLocation = $location.path();
    });

    function getGuid() {
      var t = (new Date).getTime(),
        e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
          var a = (t + 16 * Math.random()) % 16 | 0;
          return t = Math.floor(t / 16), ("x" == e ? a : 3 & a | 8).toString(16)
        });
      return e
    }

    if (!$cookies.get('sessionid')) $cookies.put('sessionid', getGuid())
    if (!$cookies.get('userkey')) $cookies.put('userkey', HAMBREENV.USER_KEY)
  }])
  .config(['$httpProvider', 'HAMBREENV', function ($httpProvider, HAMBREENV) {
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['user-key'] = HAMBREENV.USER_KEY;
  }]);