/**
 * Created by syedm on 14-04-2017.
 */

/*parkingReservation.run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Send this header only in post requests. Specifies you are sending a JSON object
    $http.defaults.headers.post['dataType'] = 'json'
});*/

parkingReservation.controller('profileController', ['$scope', '$location', '$window','$http', '$timeout' ,function($scope, $location, $window,$http, $timeout) {

    var profileController = this;

    profileController.userData = gUserData;

    $window.document.title = "GoParking";


    profileController.profileData= gProfileData;

    $("#reservation_ul").show();
    $("#reservation_nodata").hide();

    $scope.removeProfile=function () {

        console.log('Insinde remove method');

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.get('http://127.0.0.1:8081/remove',{params: {email:profileController.userData.email}}).then(function (res,status, headers, config) {
            $scope.out=res;
            toastr.success('User Account Deleted Successfully. Please register to login again!');
            $timeout(function() {
                $location.path("/");
            }, 2000);
        });


    }

    $scope.cancelProfile=function () {

        console.log('Insinde remove method');

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.get('http://127.0.0.1:8081/cancel',{params: {email:profileController.profileData.email}}).then(function (res,status, headers, config) {
            $scope.out=res;
            $("#reservation_ul").hide();
            $("#reservation_nodata").show();
            toastr.success('Reservation Deleted Successfully!');
        })


        $location.path("/profile");
    };

    $scope.goToHome = function () {
      $location.path('home');
    };

    $scope.goToLogin = function () {
        toastr.success('Logged Out Successfully!');
        $timeout(function() {
                $location.path('login');
        }, 1000);
    };

}
]);