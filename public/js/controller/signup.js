angular.module("TodoApp")
    .controller("signupCtrl", ["ref", "$scope", "$firebaseArray", "$firebaseObject","$state", taskFunction]);


function taskFunction(ref, $scope, $firebaseArray, $firebaseObject,$state) {
    var task = new Firebase(ref);
    $scope.createAccount = function () {
        task.createUser({
            email: $scope.user.userName,
            password: $scope.user.password
        }, function (error, userData) {
            if (userData) {
                var user = $firebaseObject(task.child(userData.uid));
                localStorage.setItem("userKey", userData.uid);
                user.profile = $scope.user;
                user.$save();
                $state.go("dashboard")
            }
        });


    }
}
