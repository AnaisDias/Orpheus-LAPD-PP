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
    .controller('therapistCtrl', therapistCtrl)
    .controller('userAccessCtrl', userAccessCtrl)
    .controller('ModalInstanceCtrl', ModalInstanceCtrl)
    .filter('secondsToDateTime', [function() {
        return function(seconds) {
            return new Date(1970, 0, 1).setMilliseconds(seconds);
        };
    }])

userAccessCtrl.inject = ['$scope', '$http', '$location', '$window'];

function userAccessCtrl($scope, $http, $location, $window) {
    $http.get('api/checkLogin').success(function(data) {
        if ($location.search().id != undefined && data != 'undefined') {
            if (data.type != 1) {
                if ($location.search().id != data.id) {
                    $window.location.href = '/#/user?id=' + data.id;
                    $window.location.reload();
                }
            }
        }
    });
}

therapistCtrl.inject = ['$scope', '$http', '$location', '$window'];

function therapistCtrl($scope, $http, $location, $window) {
    var id = null;
    $http.get('api/checkLogin').success(function(data) {
        if (data != 'undefined') {
            if ($location.search().id == undefined) {
                id = data.id;
            } else {
                id = $location.search().id;
            }
            if (data.type == 1) {
                $http.get('/api/patient/list/' + id).success(function(data) {
                    $scope.patients = data.usersArr;
                    console.log($scope.patients[0].fullname);
                }).error(function(data) {
                    console.log("erro ao ir buscar pacientes");
                });
            } else {
                $window.location.href = '/#/user?id=' + id;
            }
        } else {
            $window.location.href = '/#/login';

        }
    }).error(function(data) {
        console.log("erro ao ir buscar pacientes");
    });
}


ModalInstanceCtrl.inject = ['$scope', '$uibModalInstance', 'items', '$cookies', '$location', '$http', '$filter', '$window'];

function ModalInstanceCtrl($scope, $uibModalInstance, items, $cookies, $location, $http, $filter, $window) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function() {

        $scope.$watch(function() {
            return $cookies.selDate;
        }, function(newVal, oldVal) {

            var id = null;
            if ($location.search().id == undefined) {
                $http.get('api/checkLogin').success(function(data) {
                    console.log("DATA IS: \n\n\n\n" + data);
                    id = data.id;
                }).error(function(data) {
                    console.log("erro ao ir buscar id");
                });
            } else {
                id = $location.search().id;
            }

            if (typeof(newVal) == 'undefined') {
                newVal = moment()._d;
            }

            unparsedDate = newVal;
            parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');

            var data1 = {
                method: 'POST',
                url: '/api/insertMood',
                data: {
                    'userid': id,
                    'mood': $scope.selected.item.score,
                    'date': parsedDate
                }
            };
            $http(data1).then(function(response) {
                if (response.data.success) {

                }
            }, function(response) {
                $scope.statusMsg = 'An error has occurred, try again!';

            });
            $uibModalInstance.close($scope.selected.item);


        }, true);

    }
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}

twitterCtrl.$inject = ['$scope', '$http', '$location', '$cookies', '$filter', '$rootScope'];

function twitterCtrl($scope, $http, $location, $cookies, $filter, $rootScope) {
    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {
        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }
        var id = null;
        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');
        if ($location.search().id == undefined) {
            $http.get('api/checkLogin').success(function(data) {
                id = data.id;
            }).error(function(data) {
                console.log("erro ao ir buscar id");
            });
        } else {
            id = $location.search().id;
        }
        if (id != null) {
            $http.get('/api/sentimentalanalysis/' + id + "/" + parsedDate).success(function(data) {
                $scope.positive = data.positive;
                $scope.negative = data.negative;
                console.debug($scope.positive);
                console.debug($scope.negative);

                $rootScope.overallScore += (data.positive / (data.positive + data.negative)) * 10;
                console.log("Result:" + $rootScope.overallResult);
                $rootScope.overallSum += 1;
                $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                console.log("Result:" + $rootScope.overallResult);
            }).error(function(data) {
                console.log("erro ao ir buscar moods");
            });
        }

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


moodDemoCtrl.$inject = ['$scope', '$http', '$location'];

function moodDemoCtrl($scope, $http, $location) {

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var elements = 27;
    var data1 = [];
    var data1tmp = [];
    $scope.labels = [];

    var id = null;
    if ($location.search().id == undefined) {
        $http.get('api/checkLogin').success(function(data) {
            console.log("O id é:" + data.id);
            id = data.id;
        }).error(function(data) {
            console.log("erro ao ir buscar id");
        });
    } else {
        id = $location.search().id;
    }


    $http.get('/api/getLastMoods/' + id).success(function(data) {
        if (!data.message) {
            data1tmp = data;
            var found = false;
            for (var i = 27; i != 0; i--) {
                $scope.labels.push(moment().subtract(i, 'days').format('MMM Do'));
                found = false;
                angular.forEach(data1tmp, function(tmp) {
                  console.log("entrou");
                    if (moment(tmp.date).isSame(moment().subtract(i, 'days'),'day')) {
                        data1.push(tmp.score);
                        found = true;
                    }
                });
                if (!found) {
                    data1.push(0);
                }

            }
            console.log(data1);



            $scope.series = ['Current', 'Previous', 'BEP'];
            $scope.data = [data1];

        }
    }).error(function(data) {
        console.log("erro ao ir buscar moods");
    });

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
        scaleStepWidth: Math.round(2),
        //bezierCurve : false,
        scaleStartValue: 0,
        pointDot: false,
    }
}

DatePickerCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '$filter', '$uibModal'];

function DatePickerCtrl($scope, $rootScope, $cookies, $http, $location, $filter, $uibModal) {

    var id = null;
    $cookies.selDate = moment()._d;
    if ($location.search().id == undefined) {
        $http.get('api/checkLogin').success(function(data) {
            console.log("O id é:" + data.id);
            id = data.id;
        }).error(function(data) {
            console.log("erro ao ir buscar id");
        });
    } else {
        id = $location.search().id;
    }

    $scope.selDate = $filter('date')(new Date(moment()._d), 'yyyy-MM-dd');


    $http.get('/api/registerdate/' + id).success(function(data) {
        var thisdate = moment(data);
        month = thisdate.month() + 1;
        if (month < 10) {
            $scope.registerdate = thisdate.year() + "-0" + month + "-" + thisdate.date();
        } else {
            $scope.registerdate = thisdate.year() + "-" + month + "-" + thisdate.date();
        }
        console.log("register date = " + $scope.registerdate);
        $scope.opts = {

            singleDatePicker: true,
            showDropdowns: true,
            drops: 'down',
            opens: 'left',
            minDate: $scope.registerdate
        };








    }).error(function(data) {
        //what to do on error
    });


    $cookies.selDate = moment()._d;
    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        var selectedDate = newDate._d;

        $cookies.selDate = selectedDate;

    }, false);

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }


    $scope.items = [{
        mood: 'Awful',
        icon: 'moodawful.svg',
        score: 0
    }, {
        mood: 'Fugly',
        icon: 'moodfugly.svg',
        score: 2.5
    }, {
        mood: 'Meh',
        icon: 'moodmeh.svg',
        score: 5
    }, {
        mood: 'Good',
        icon: 'moodgood.svg',
        score: 7.5
    }, {
        mood: 'Awesome',
        icon: 'moodawesome.svg',
        score: 10
    }];

    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {

        var id = null;
        if ($location.search().id == undefined) {
            $http.get('api/checkLogin').success(function(data) {
                console.log("O id é:" + data.id);
                id = data.id;
            }).error(function(data) {
                console.log("erro ao ir buscar id");
            });
        } else {
            id = $location.search().id;
        }

        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }

        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');

        $http.get('/api/getMood/' + id + "/" + parsedDate).success(function(data) {
            console.log("mood for " + parsedDate + " is:");
            console.log(data);
            if (!data.message) {
                $scope.nomood = null;
                $scope.todaysmood = data.score;

                $rootScope.overallScore += data.score;
                $rootScope.overallSum += 1;
                $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);

                $scope.todaysmoodimg = $scope.items[$scope.todaysmood / 2.5].icon;
            } else {
                $scope.nomood = 1;
            }
        }).error(function(data) {
            $scope.nomood = 1;
        });

    }, true);









    $scope.animationsEnabled = true;

    $scope.open = function(size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


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

activityCtrl.$inject = ['$scope', '$cookies', '$window', '$http', '$filter', '$location', '$rootScope'];

function activityCtrl($scope, $cookies, $window, $http, $filter, $location, $rootScope) {



    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {

        var id = null;
        if ($location.search().id == undefined) {
            $http.get('api/checkLogin').success(function(data) {
                console.log("O id é:" + data.id);
                id = data.id;
            }).error(function(data) {
                console.log("erro ao ir buscar id");
            });
        } else {
            id = $location.search().id;
        }

        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }

        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');
        $http.get('/api/fitbit/activity/' + parsedDate + "/" + id).success(function(data) {
            if (data.message == "Error retrieving activity.") {
                $rootScope.overallScore += 1;
                $rootScope.overallSum += 1;
                $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
            }
            console.log(data);
            if (!data.message) {
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
                    $rootScope.overallScore += 10;
                    $rootScope.overallSum += 1;
                    $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                    console.log("Result:" + $rootScope.overallResult);
                } else {
                    $scope.calgreaterthanone = false;
                    $rootScope.overallScore += $scope.caloriesVSGoals * 10;
                    $rootScope.overallSum += 1;
                    $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                    console.log("Result:" + $rootScope.overallResult);
                }

                if ($scope.stepsVSGoals >= 1) {
                    $scope.stepsgreaterthanone = true;
                    $rootScope.overallScore += 10;
                    $rootScope.overallSum += 1;
                    $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                    console.log("Result:" + $rootScope.overallResult);
                } else {
                    $scope.calgreaterthanone = false;
                    $rootScope.overallScore += $scope.stepsVSGoals * 10;
                    $rootScope.overallSum += 1;
                    $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                    console.log("Result:" + $rootScope.overallResult);

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
            } else {

            }
        }).error(function(data) {
            //what to do on error
        });


    }, true);



}
//change to take situations from database,
situmanCtrl.$inject = ['$scope', '$cookies', '$window', '$http', '$filter', '$location'];

function situmanCtrl($scope, $cookies, $window, $http, $filter, $location) {
    $scope.cenas = {};
    $scope.myform= {};


    $scope.insertSitMood = function(userid, mood, situation) {
        console.log(userid + mood + situation);
        var data = {
                userid: userid,
                situation: situation,
                mood: mood
            };
        console.debug(data);
      $http.post('/api/insertsituationmood', data).
        success(function(data) {
            console.log("posted successfully");
        }).error(function(data) {
            console.error("error in posting");
        });

    }

    $scope.$watch(function() {
        return $cookies.selDate;
    }, function(newVal, oldVal) {
        var id = null;
        if ($location.search().id == undefined) {
            $http.get('api/checkLogin').success(function(data) {
                console.log("O id é:" + data.id);
                id = data.id;
            }).error(function(data) {
                console.log("erro ao ir buscar id");
            });
        } else {
            id = $location.search().id;
        }

        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }
        console.log("The date has changed from " + oldVal + " to " + newVal);

        unparsedDate = newVal;
        var size = 0;
        var sizee = 0;
        $scope.userid = id;
        $scope.situations = [];
        $scope.moods = [];
        parsedDate = $filter('date')(new Date(unparsedDate), 'dd-MM-yyyy');
        console.log("debuging");
        console.log('/api/situationData/' + parsedDate + "/" + id);
        $http.get('/api/situationData/' + parsedDate + "/" + id).success(function(data) {
            console.debug(data);
            //jsonD = JSON.parse(JSONdata);
            for (var i in data) {
                $scope.situations[size] = [];
                $scope.situations[size].name = i;
                $scope.situations[size].count = data[i];
                size += 1;
            }

            //$scope.situations = jsonD.situations;
            // console.log("situations:" + $scope.situations[0].name);

        }).error(function(data) {
            console.log("error on situmanCtrl");
        });
        console.log('/api/moodsituation/' + id);
        $http.get('/api/moodsituation/' + id).success(function(data) {
            var jsond = JSON.parse(data);
            for (var j in jsond) {
                $scope.moods[sizee] = [];
                $scope.moods[sizee].situation = jsond[j].situation;
                $scope.moods[sizee].score = Math.round(jsond[j].score / jsond[j].moods);
                sizee += 1;
            }
        }).error(function(data) {
            console.log("error on situmanCtrl, mood situation section");
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

sleepCtrl.$inject = ['$scope', '$cookies', '$filter', '$http', '$location', '$rootScope'];

function sleepCtrl($scope, $cookies, $filter, $http, $location, $rootScope) {



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
        var id = null;
        if ($location.search().id == undefined) {
            $http.get('api/checkLogin').success(function(data) {
                console.log("O id é:" + data.id);
                id = data.id;
            }).error(function(data) {
                console.log("erro ao ir buscar id");
            });
        } else {
            id = $location.search().id;
        }
        if (typeof(newVal) == 'undefined') {
            newVal = moment()._d;
        }

        unparsedDate = newVal;
        parsedDate = $filter('date')(new Date(unparsedDate), 'yyyy-MM-dd');
        $http.get('/api/fitbit/sleep/' + parsedDate + "/" + id).success(function(data) {




            var labelsArray = [];
            var graphData = [
                []
            ];
            console.debug(data);
            if (data.message == "Error retrieving sleep log.") {
                $rootScope.overallScore += 1;
                $rootScope.overallSum += 1;
                $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
            }
            if (!data.message) {

                console.log(JSON.parse(data));
                data = JSON.parse(data);
                if (data.sleep) {
                    angular.forEach(data.sleep[0].minuteData, function(datevalue) {
                        graphData[0].push(parseInt(datevalue.value));
                    });
                }
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

                var sevenhours = 7 * 60;
                var twohours = 2 * 60;
                if (totalTimeInBed < sevenhours) {
                    if (totalTimeInBed > twohours) {
                        $rootScope.overallScore += totalTimeInBed / 60 - 2;
                        $rootScope.overallSum += 1;
                        $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                        console.log("Result:" + $rootScope.overallResult);

                    } else {
                        $rootScope.overallScore += 1;
                        $rootScope.overallSum += 1;
                        $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                        console.log("Result:" + $rootScope.overallResult);
                    }
                    console.log(graphData);
                    console.log($scope.data);
                    $scope.data = graphData;
                    $scope.labels = labelsArray;
                } else if (totalTimeInBed > sevenhours) {
                    $rootScope.overallScore += 10;
                    $rootScope.overallSum += 1;
                    $rootScope.overallResult = Math.round($rootScope.overallScore / $rootScope.overallSum);
                    console.log("Result:" + $rootScope.overallResult);
                }
            }



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
