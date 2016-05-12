angular.module("TodoApp")
    .controller("loginCtrl", ["ref", "$scope", "$firebaseArray", "$state", taskFunction]);


function taskFunction(ref, $scope, $firebaseArray, $state, $firebaseObject) {
        var task = new Firebase(ref);
        $scope.loginAccount = function () {
            task.authWithPassword({
                email: $scope.user.userName,
                password: $scope.user.password
            }, function (error, authData) {
                if (error) {

                } else {
                    localStorage.setItem("userKey",authData.uid);
                    $state.go("dashboard");
                }
            });

        }
}
