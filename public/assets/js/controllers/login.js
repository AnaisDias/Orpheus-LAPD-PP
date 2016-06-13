

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
                $window.location.href = "/auth/twitter";
            }
            else {
                $scope.statusMsg = 'User doesn\'t exist in our database!';
            }
        } , function (response) {
            $scope.statusMsg = 'An error has occurred, try again!';

        });
    }
}

checkLoginCtrl.$inject = ['$http', '$window'];
function checkLoginCtrl($http, $window) {

    $http.get('/api/checkLogin').success(function(data) {
        if (data.success) $window.location.href = '/#/dashboard';
    }).error(function() {
        $window.location.href = '/#/login';
    });

}