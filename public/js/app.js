// Register Service Worker
if ('serviceWorker' in navigator) {

    var ref = new Firebase("https://pwa-todoapp.firebaseio.com/");

    console.log('Service Worker is supported');

    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {

        console.log(':^)', registration);

        // SUBSCRIBING FOR PUSH NOTIFICATIONS
        navigator.serviceWorker.ready.then(function (reg) {
            reg.pushManager.subscribe({ userVisibleOnly: true }).then(function (subcription) {
                console.log('Subcription: ', subcription.toJSON());

                // The subcription was successful
                var user = localStorage.getItem("userKey");
                if (user) {
                    ref.child("user-push-notification").child(user).set(subcription.toJSON(), function (err) {
                        if (err) {
                            console.log('err on firebase: ', err);
                        }

                        console.log('updated in firebase');
                    });
                }

            }).catch(function (e) {
                // Permission denied or an error occurred
                console.log('Permission denied  :^( ');

                ref.child("user-errors").child('on-permission').push(e.toJSON(), function (err) {
                    console.log('FB: ', err);
                });
            });
        });

        // registration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
        //     console.log('subscription:', subscription.toJSON());
        // });

    }).catch(function (error) {
        console.log(':^(', error);

        ref.child("user-errors").child('on-registration').push(error.toJSON(), function (err) {
            console.log('FB: ', err);
        });

    });

} //if serviceWorker


// Angular
angular.module("TodoApp", ["ngMaterial", "ngMdIcons", "firebase", "angular-img-cropper", "ui.router"])
    .constant("ref", "https://pwa-todoapp.firebaseio.com/")
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {


                var userKey = localStorage.getItem("userKey");

                // checking if user authenticated
                if (toState.name === "dashboard" && !userKey) {
                    event.preventDefault();
                    $state.go("login")
                }
                else if ((toState.name === "login" || toState.name === "signup") && userKey) {
                    event.preventDefault();
                    $state.go("dashboard")
                }
            })
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("signup", {
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: "signupCtrl"
            })
            .state("login", {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: "loginCtrl"
            })
            .state("dashboard", {
                url: "/dashboard",
                templateUrl: "templates/dashboard.html",
                controller: "Dashboard"
            });

        $urlRouterProvider.otherwise("login")
    })

    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });