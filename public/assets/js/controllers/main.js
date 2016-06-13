//main.js
angular
    .module('app')
    .controller('navbarCtrl', navbarCtrl)
    .controller('toastrWelcome', toastrWelcome)
    .controller('moodDemoCtrl', moodDemoCtrl)
    .controller('socialBoxCtrl', socialBoxCtrl)
    .controller('DatePickerCtrl', DatePickerCtrl)
    .controller('sparklineChartCtrl', sparklineChartCtrl)
    .controller('gaugeCtrl', gaugeCtrl)
    .controller('barChartCtrl', barChartCtrl)
    .controller('gaugeJSDemoCtrl', gaugeJSDemoCtrl)
    .controller('activityCtrl', activityCtrl)
    .controller('clientsTableCtrl', clientsTableCtrl)
    .controller('cardChartCtrl1', cardChartCtrl1)
    .controller('cardChartCtrl2', cardChartCtrl2)
    .controller('sleepCtrl', sleepCtrl)
    .controller('cardChartCtrl4', cardChartCtrl4)
    .controller('twitterCtrl', twitterCtrl)
    .controller('situmanCtrl', situmanCtrl)
    .filter('secondsToDateTime', [function() {
        return function(seconds) {
            return new Date(1970, 0, 1).setMilliseconds(seconds);
        };
    }])




    twitterCtrl.$inject = ['$scope', '$http','$location','$cookies','$filter'];

    function twitterCtrl($scope, $http,$location,$cookies,$filter) {

        $scope.$watch(function() {
            return $cookies.selDate;
        }, function(newVal, oldVal) {
            if (typeof(newVal) == 'undefined') {
                newVal = moment()._d;
            }

            unparsedDate = newVal;
            parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');

            console.log("user id: "+$location.search().id);
            console.log("parsed date: " + parsedDate);

            $http.get('/api/sentimentalanalysis/' + $location.search().id + "/"+parsedDate).success(function(data) {
              console.log(data);
            }).error(function(data) {
                console.log("erro ao ir buscar moods");
            });


        }, true);

    }
navbarCtrl.$inject = ['$scope', '$http', '$window'];

function navbarCtrl($scope, $http, $window) {
    $http.get('/api/username').success(function(data) {
        if (data.username == undefined) $window.location.href = '/#/login';
        $scope.username = data.username;
        $scope.avatar = data.avatar;
    }).error(function(data) {
        $window.location.href = '/#/login';
    });
}

toastrWelcome.$inject = ['$scope', 'toastr'];

function toastrWelcome($scope, toastr) {
    /*toastr.info('Bootstrap 4 & AngularJS UI Kit', 'Welcome to ROOT Admin', {
        closeButton: true,
        progressBar: true,
    });
    */
}

//convert Hex to RGBA
function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}


moodDemoCtrl.$inject = ['$scope'];

function moodDemoCtrl($scope) {

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var elements = 27;
    var data1 = [];
    var data2 = [];
    var data3 = [];

    for (var i = 0; i <= elements; i++) {
        data1.push(random(50, 200));
        data2.push(random(80, 100));
        data3.push(65);
    }

    $scope.labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
    $scope.series = ['Current', 'Previous', 'BEP'];
    $scope.data = [data1, data2, data3];
    $scope.colours = [{
        fillColor: convertHex(brandInfo, 10),
        strokeColor: brandInfo,
        pointColor: brandInfo,
        pointStrokeColor: 'transparent'
    }, {
        fillColor: 'transparent',
        strokeColor: brandSuccess,
        pointColor: brandSuccess,
        pointStrokeColor: 'transparent'
    }, {
        fillColor: 'transparent',
        strokeColor: brandDanger,
        pointColor: brandDanger,
        pointStrokeColor: 'transparent'
    }];
    $scope.options = {
        tooltipFillColor: '#2a2c36',
        tooltipTitleFontSize: 12,
        tooltipCornerRadius: 0,
        responsive: true,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        scaleOverride: true,
        scaleSteps: 5,
        scaleStepWidth: Math.ceil(250 / 5),
        //bezierCurve : false,
        scaleStartValue: 0,
        pointDot: false,
    }
}

DatePickerCtrl.$inject = ['$scope', '$cookies', '$http', '$location', '$filter'];

function DatePickerCtrl($scope, $cookies, $http, $location, $filter) {
    $scope.registerdate;
    $http.get('/api/registerdate/' + $location.search().id).success(function(data) {
        var thisdate = moment(data);
        month = thisdate.month() + 1;
        if (month < 10) {
            $scope.registerdate = thisdate.year() + "-0" + month + "-" + thisdate.date();
        } else {
            $scope.registerdate = thisdate.year() + "-" + month + "-" + thisdate.date();
        }


        console.log("register date " + $scope.registerdate);
    }).error(function(data) {
        //what to do on error
    });
    $scope.date = {
        startDate: moment()


    };

    $cookies.selDate = moment()._d;

    $scope.opts = {

        singleDatePicker: true,
        showDropdowns: true,
        drops: 'down',
        opens: 'left',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 days': [moment().subtract(7, 'days'), moment()],
            'Last 30 days': [moment().subtract(30, 'days'), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        }
    };

    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        var selectedDate = newDate._d;

        $cookies.selDate = selectedDate;
    }, false);

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }
}

socialBoxCtrl.$inject = ['$scope'];

function socialBoxCtrl($scope) {

    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data1 = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.data2 = [
        [1, 13, 9, 17, 34, 41, 38]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        pointHitDetectionRadius: 0,
        showScale: false,
        scaleLineWidth: 0.001,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        pointDot: false,
        showTooltips: false
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.1)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
}

sparklineChartCtrl.$inject = ['$scope'];

function sparklineChartCtrl($scope) {
    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.data1 = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.data2 = [
        [1, 13, 9, 17, 34, 41, 38]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        pointHitDetectionRadius: 0,
        showScale: false,
        scaleLineWidth: 0.001,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        pointDot: false,
        showTooltips: false
    };
    $scope.default = [{
        fillColor: 'transparent',
        strokeColor: '#d1d4d7',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.primary = [{
        fillColor: 'transparent',
        strokeColor: brandPrimary,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.info = [{
        fillColor: 'transparent',
        strokeColor: brandInfo,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.danger = [{
        fillColor: 'transparent',
        strokeColor: brandDanger,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.warning = [{
        fillColor: 'transparent',
        strokeColor: brandWarning,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.success = [{
        fillColor: 'transparent',
        strokeColor: brandSuccess,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
}

activityCtrl.$inject = ['$scope', '$cookies', '$window', '$http', '$filter', '$location'];

function activityCtrl($scope, $cookies, $window, $http, $filter, $location) {



    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {
        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }

        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');
        $http.get('/api/fitbit/activity/' + parsedDate + "/" + $location.search().id).success(function(data) {
            console.log(data);
            data = JSON.parse(data);
            $scope.activities = data.activities;
            $scope.goals = data.goals;
            $scope.summary = data.summary;

            $scope.stepsVSGoals = ($scope.summary.steps / $scope.goals.steps);
            console.log("stepsVSGoals: " + $scope.stepsVSGoals);
            $scope.activitiesTotal;

            $scope.caloriesVSGoals = ($scope.summary.caloriesOut / $scope.goals.caloriesOut);

            if ($scope.caloriesVSGoals >= 1) {
                $scope.calgreaterthanone = true;
            } else {
                $scope.calgreaterthanone = false;
            }

            if ($scope.stepsoriesVSGoals >= 1) {
                $scope.stepsgreaterthanone = true;
            } else {
                $scope.calgreaterthanone = false;

            }
            console.log("caloriesVSGoals: " + $scope.caloriesVSGoals);



            angular.forEach($scope.summary.distances, function(summaryAct) {
                if (summaryAct.activity == 'total') {
                    $scope.totalDistance = summaryAct.distance;
                    $scope.distanceVSGoals = ($scope.totalDistance / $scope.goals.distance);
                    if ($scope.stepsVSGoals >= 1) {
                        $scope.distgreaterthanone = true;
                    } else {
                        $scope.distgreaterthanone = false;
                    }
                }

            });


            //$scope.caloriesVSGoals=


            $scope.gender = [{
                title: 'Male',
                icon: 'icon-user',
                value: 43
            }, {
                title: 'Female',
                icon: 'icon-user-female',
                value: 37
            }, ];

            $scope.source = [{
                    title: 'Steps',
                    icon: 'icon-like',
                    value: $scope.summary.steps,
                    percentOut: $scope.stepsVSGoals,
                    percent: $scope.stepsVSGoals * 100,
                    greterthan: $scope.stepsgreaterthanone
                }, {
                    title: 'Distance',
                    icon: 'icon-like',
                    value: $scope.totalDistance,
                    percentOut: $scope.distanceVSGoals,
                    percent: $scope.distanceVSGoals * 100,
                    greterthan: $scope.distgreaterthanone
                }, {
                    title: 'Calories',
                    icon: 'icon-like',
                    value: $scope.summary.caloriesOut,
                    percentOut: $scope.caloriesVSGoals,
                    percent: $scope.caloriesVSGoals * 100,
                    greterthan: $scope.calgreaterthanone
                }

            ];





        }).error(function(data) {
            //what to do on error
        });


    }, true);



}
//change to take situations from database,
situmanCtrl.$inject = ['$scope', '$cookies', '$window', '$http', '$filter'];

function situmanCtrl($scope, $cookies, $window, $http, $filter) {



    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {
        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }
        console.log("The date has changed from " + oldVal + " to " + newVal);

        unparsedDate = newVal;
        var size = 0;
        $scope.situations = [];
        parsedDate = $filter('date')(new Date(unparsedDate), 'dd-MM-yyyy');
        $http.get('/api/situationData/' + parsedDate).success(function(data) {
            console.debug(data);
            //jsonD = JSON.parse(JSONdata);
            for(var i in data){
                $scope.situations[size] = [];
                $scope.situations[size].name = i;
                $scope.situations[size].count = data[i];
                size +=1;
            }
            console.log("situations:" + $scope.situations[0].name);
            //$scope.situations = jsonD.situations;
        }).error(function(data) {
            console.log("error on situmanCtrl");
        });


    }, true);



}







clientsTableCtrl.$inject = ['$scope', '$timeout'];

function clientsTableCtrl($scope, $timeout) {

    $scope.users = [{
        avatar: '1.jpg',
        status: 'active',
        name: 'Yiorgos Avraamu',
        registered: 'Jan 1, 2015',
        activity: '10 sec ago',
        transactions: 189,
        comments: 72
    }, {
        avatar: '2.jpg',
        status: 'busy',
        name: 'Avram Tarasios',
        registered: 'Jan 1, 2015',
        activity: '5 minutes ago',
        transactions: 156,
        comments: 76
    }, {
        avatar: '3.jpg',
        status: 'away',
        name: 'Quintin Ed',
        registered: 'Jan 1, 2015',
        activity: '1 hour ago',
        transactions: 189,
        comments: 72
    }, {
        avatar: '4.jpg',
        status: 'offline',
        name: 'Enéas Kwadwo',
        registered: 'Jan 1, 2015',
        activity: 'Last month',
        transactions: 189,
        comments: 72
    }, {
        avatar: '5.jpg',
        status: 'active',
        name: 'Agapetus Tadeáš',
        registered: 'Jan 1, 2015',
        activity: 'Last week',
        transactions: 189,
        comments: 72
    }, {
        avatar: '6.jpg',
        status: 'busy',
        name: 'Friderik Dávid',
        registered: 'Jan 1, 2015',
        activity: 'Yesterday',
        transactions: 189,
        comments: 72
    }]
}


gaugeCtrl.$inject = ['$scope'];

function gaugeCtrl($scope) {
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    $scope.gauge1 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandInfo,
            // Colors
            colorStop: brandInfo,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge2 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandSuccess,
            // Colors
            colorStop: brandSuccess,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge3 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandWarning,
            // Colors
            colorStop: brandWarning,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge4 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandDanger,
            // Colors
            colorStop: brandDanger,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

barChartCtrl.$inject = ['$scope'];

function barChartCtrl($scope) {

    var elements = 16;
    var labels = [];
    var data = [];
    var data1 = [];
    var data2 = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40, 100));
        data1.push(random(20, 100));
        data2.push(random(60, 100));
    }

    $scope.labels = labels;

    $scope.data = [data];
    $scope.data1 = [data1];
    $scope.data2 = [data2];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barStrokeWidth: 0,
        barBackground: 'rgba(221, 224, 229, 1)',

        // pointDot :false,
        // scaleLineColor: 'transparent',
    };

    $scope.colours = [{
        fillColor: brandInfo,
        strokeColor: 'rgba(0,0,0,1)',
        highlightFill: '#818a91',
        pointStrokeColor: '#000'
    }];
}

gaugeJSDemoCtrl.$inject = ['$scope', '$timeout'];

function gaugeJSDemoCtrl($scope, $timeout) {

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    $scope.gauge1 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandInfo,
            // Colors
            colorStop: brandInfo,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge2 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandSuccess,
            // Colors
            colorStop: brandSuccess,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge3 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandWarning,
            // Colors
            colorStop: brandWarning,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }

    $scope.gauge4 = {
        animationTime: 10,
        value: random(0, 3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandDanger,
            // Colors
            colorStop: brandDanger,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    }
}

cardChartCtrl1.$inject = ['$scope'];

function cardChartCtrl1($scope) {

    $scope.labels = ['April 22', 'April 23', 'April 24', 'April 25', 'April 26', 'Yesterday', 'Today'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 3,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)'
    };
    $scope.colours = [{
        fillColor: brandPrimary,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl2.$inject = ['$scope'];

function cardChartCtrl2($scope) {

    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
        [1, 18, 9, 17, 34, 22, 11]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 5,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)',
        bezierCurve: false,
    };
    $scope.colours = [{
        fillColor: brandInfo,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

sleepCtrl.$inject = ['$scope', '$cookies', '$filter', '$http', '$location'];

function sleepCtrl($scope, $cookies, $filter, $http, $location) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        pointDotStrokeWidth: 0,
        pointDotRadius: 0,
        scaleGridLineWidth: 0,
        //pointHitDetectionRadius : 0,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.2)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {
        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }

        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');
        $http.get('/api/fitbit/sleep/' + parsedDate + "/" + $location.search().id).success(function(data) {
            var labelsArray = [];
            var graphData = [
                []
            ];
            console.log(JSON.parse(data));
            data = JSON.parse(data);
            angular.forEach(data.sleep[0].minuteData, function(datevalue) {
                graphData[0].push(parseInt(datevalue.value));
            });
            var totalTimeInBed = data.summary.totalTimeInBed;
            var i = 1;
            while (i <= totalTimeInBed) {
                labelsArray.push(i.toString());
                i++;
            }
            console.log(graphData);
            console.log($scope.data);
            $scope.data = graphData;
            $scope.labels = labelsArray;

        }).error(function(data) {
            //what to do on error
        });
    }, true);

}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

cardChartCtrl4.$inject = ['$scope'];

function cardChartCtrl4($scope) {

    var elements = 16;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40, 100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke: false,
        barStrokeWidth: 0,
        scaleGridLineWidth: 0,
        barValueSpacing: 3,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.3)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}
