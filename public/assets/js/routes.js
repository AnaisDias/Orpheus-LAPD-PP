angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

        $urlRouterProvider.otherwise('/login');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: true
        });

        $breadcrumbProvider.setOptions({
            prefixStateName: 'app.main',
            includeAbstract: true,
            template: '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
        });

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'views/common/layouts/full.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                        }]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/shared.js']
                        });
                    }]
                }
            })
            .state('app.main', {
                url: '/user?id',
                templateUrl: 'views/main.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: '{{ "TITLE" | translate }}'
                },
                //page subtitle goes here
                params: {
                    subtitle: 'Welcome to e-Health'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            files: ['assets/js/libs/moment.min.js']
                        }, {
                            serie: true,
                            files: ['assets/js/libs/daterangepicker.min.js', 'assets/js/libs/angular-daterangepicker.min.js']
                        }, {
                            serie: true,
                            name: 'chart.js',
                            files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                        }, {
                            serie: true,
                            files: ['assets/js/libs/gauge.min.js']
                        }, {
                            serie: true,
                            files: ['assets/js/libs/angular-toastr.tpls.min.js']
                        }]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/main.js']
                        });
                    }]
                }
            })



        .state('appSimple', {
            abstract: true,
            templateUrl: 'views/common/layouts/simple.html',
            resolve: {

                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load controllers
                    return $ocLazyLoad.load({
                        files: ['assets/js/controllers/login.js']
                    });
                }]
            }
        })



        // Additional Pages
        .state('appSimple.login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
            .state('appSimple.register', {
                url: '/register',
                templateUrl: 'views/register.html',
                resolve: {

                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/register.js']
                        });
                    }]
                }
            })
            .state('appSimple.404', {
                url: '/404',
                templateUrl: 'views/pages/404.html'
            })
            .state('appSimple.500', {
                url: '/500',
                templateUrl: 'views/pages/500.html'
            })

    }]);
