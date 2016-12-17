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
    'google-maps',
    'ngSanitize'
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
        controllerAs: 'list',
        resolve: {
          categoriesObj: ['commonApiService', function(commonApiService){
            return commonApiService.getCategory().then(function(res){
              return res.data;
            })
          }],
          collectionObj: ['commonApiService', '$localStorage', function(commonApiService, $localStorage){
            return commonApiService.getCollections($localStorage.locationData, 20).then(function(res){
              return res.data;
            })
          }]
        }
      })
      .state('home.restaurantDetail', {
        url: 'restaurants/:id',
        templateUrl: 'views/restaurentDetail.tmpl.html',
        controller: 'restoDetailCtrl',
        controllerAs: 'detail',
        resolve: {
          RestaruantDetail:['restaurantApiService', '$stateParams', function (restaurantApiService, $stateParams) {
            return restaurantApiService.getRestoDetail($stateParams.id).then(function(res) {
                return res.data
              })
          }],
          ReviewObj:['restaurantApiService', '$stateParams', function (restaurantApiService, $stateParams) {
            return restaurantApiService.getReviews($stateParams.id).then(function(res) {
                return res.data
              })
          }]
        }
      })
    
    $localStorageProvider.setKeyPrefix('hambre-')
    
  }])
  .run(['amMoment', '$state', '$location', '$rootScope', '$localStorage', '$cookies', 'HAMBREENV', function (amMoment, $state, $location, $rootScope, $localStorage, $cookies, HAMBREENV) {

    $rootScope.baseUrl = HAMBREENV.BASE_URL
    $rootScope.$apply()

    $rootScope.$on('$locationChangeSuccess', function () {
      $rootScope.actualLocation = $location.path();
    });

    if (!$cookies.get('userkey')) $cookies.put('userkey', HAMBREENV.USER_KEY)
  }])
  .config(['$httpProvider', 'HAMBREENV', function ($httpProvider, HAMBREENV) {
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.common['user-key'] = HAMBREENV.USER_KEY;
  }]);