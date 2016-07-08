// Genesis App configuration
var appName = 'E-Health';
var breadcrumbPrefix = true;
var breadcrumbPrefixName = 'E-Health';

// General
var headTitle = 'E-Health';

//Default colours
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

angular
    .module('app', [
        'ngAnimate',
        'ui.router',
        'oc.lazyLoad',
        'pascalprecht.translate',
        'ncy-angular-breadcrumb',
        'angular-loading-bar',
        'ngCookies',
        'percentage',
        'ui.bootstrap'
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;
    }])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess',function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $rootScope.$state = $state;
        $rootScope.overallScore = 0;
    $rootScope.overallSum = 0;
    $rootScope.overallResult = 0;
        return $rootScope.$stateParams = $stateParams;
    }])
    .factory('Score', function() {
        var Score = {
    overallScore: 0,
    overallSum: 0,
    overallResult: 0
  };
  return Service;
});
