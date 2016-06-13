
angular
    .module('app')
    .controller('registerCtrl', registerCtrl);

registerCtrl.$inject = ['$scope', '$http', '$window'];
function registerCtrl($scope, $http, $window) {
    $scope.submit = function (){
        $scope.statusMsg = 'Sending data to server...';
        if(this.fullname == "" || this.username == "" || this.email == "" || this.password == ""){
            $scope.statusMsg = "Some data is missing. Make sure you fill everything!";
        }
        else if(this.password == this.rPassword) {
            var ntype = 0;
            if (this.typeOf == "therapist"){
                ntype = 1;
            }
            var data1 = {
                method: 'POST',
                url: '/api/register',
                data: {
                    'fullname': this.fullname,
                    'username': this.username,
                    'email': this.email,
                    'password': this.password,
                    'rPassword': this.rPassword,
                    'type': ntype
                }
            };
            $http(data1).then( function(response){
                if(response.data.success){
                    $window.location.href = "/#/login";
                }
                else if(response.data.exists){
                    $scope.statusMsg = 'Username or e-mail already exists in our database!';
                }
            } , function (response) {
                $scope.statusMsg = 'An error has occurred, try again!';
                
            });
        }
        else{
            $scope.statusMsg = 'Passwords do not match!';
        }
    }
}