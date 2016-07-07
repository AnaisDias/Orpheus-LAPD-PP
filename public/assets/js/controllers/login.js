

angular
    .module('app')
    .controller('loginCtrl', loginCtrl)
    .controller('checkLoginCtrl', checkLoginCtrl);

loginCtrl.$inject = ['$scope', '$http', '$window'];
function loginCtrl($scope, $http, $window) {
    $scope.submit = function(){
        var data1 = {
            method: 'POST',
            url: '/api/login',
            data: {
                'user': this.user,
                'pass': this.pass
            }
        };
        $http(data1).then( function(response){
            if(response.data.success){
                if(response.data.type == 1){
                    $http.get('/api/patient/list/' + response.data.id).success(function (data) {
                        $scope.patients = data.usersArr;
                        $window.location.href = '/#/therapist?id=' + response.data.id;

                    }).error(function (data) {
                        $scope.statusMsg = 'An error has occurred, try again!';
                    });
                }
                else {
                    $window.location.href = "/auth/twitter";
                }
            }
            else {
                $scope.statusMsg = 'An error has occurred, try again!';
            }
        } , function (response) {
            $scope.statusMsg = 'An error has occurred, try again!';

        });
    }
}

checkLoginCtrl.$inject = ['$http', '$window'];
function checkLoginCtrl($http, $window) {

    $http.get('/api/checkLogin').success(function(data) {
        if (data != 'undefined') $window.location.href = '/#/user?id=' + data;
    }).error(function() {
        $window.location.href = '/#/login';
    });

}