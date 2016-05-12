angular.module("TodoApp")
    .controller("Dashboard", ["ref", "$scope", "$mdSidenav", "$mdDialog", "$firebaseArray", "$firebaseObject", "$location", taskFunction]);


function taskFunction(ref, $scope, $mdSidenav, $mdDialog, $firebaseArray, $firebaseObject, $location) {

    $location.path("/dashboard");

    var userKey = localStorage.getItem("userKey");


    $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };
    $scope.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
    var task = new Firebase(ref);
    $scope.tasks = $firebaseArray(task.child(userKey).child("tasks"));
    // $scope.tasks = $firebaseArray(task.child("tasks"));
    $scope.cropper = {
        sourceImage: null,
        croppedImage: null
    };
    $scope.completed = 0;
    $scope.remaining = 0;
    $scope.profile = $firebaseObject(task.child(userKey).child("profile"));
    $scope.addNewTask = function () {
        $mdDialog.hide();
        $scope.tasks.$add({task: $scope.task, done: false}).then(function () {
        });
    };
    $scope.removeTask = function (task) {
        $scope.tasks.$remove(task).then(function () {
        });
    };
    $scope.status = function () {
        var completed = 0;
        var remaining = 0;
        angular.forEach($scope.tasks, function (val) {
            val.done ? ++completed : ++remaining;
        });
        return {completed: completed, remaining: remaining}
    };
    $scope.doCompleted = function (task) {
        task.done = !task.done;
        $scope.tasks.$save(task);
    };
    $scope.showAlert = function (ev, tmp) {
        $mdDialog.show({
            controller: "Dashboard",
            templateUrl: tmp,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };
    $scope.saveImg = function (cancel) {
        $mdDialog.hide();
        if ($scope.cropper.croppedImage && cancel) {
            $scope.profile.data = $scope.cropper.croppedImage;
            $scope.profile.$save();
        }
    };
    $scope.logOut = function () {
        localStorage.removeItem("userKey");
        $location.path("/login");
    }


}
