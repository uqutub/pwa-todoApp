// Register Service Worker
if ('serviceWorker' in navigator) {

    console.log('Service Worker is supported');
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        
        console.log(':^)', registration);
        
        // SUBSCRIBING FOR PUSH NOTIFICATIONS
        navigator.serviceWorker.ready.then(function(reg){
        reg.pushManager.subscribe({userVisibleOnly: true}).then(function(subcription){
            console.log('Subcription: ', subcription.toJSON());
            
            // The subcription was successful
            var user = localStorage.getItem("userKey");
            if(user) {
                var ref = new Firebase("https://pwa-todoapp.firebaseio.com/");
                ref.child("user-push-notification").child(user).set(subcription.toJSON(), function(err){
                    console.log('FB: ', err);
                });
            }
            
        }).catch(function(e){
                // Permission denied or an error occurred
                console.log('Permission denied  :^( '); 
           }); 
        });
        
        // registration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
        //     console.log('subscription:', subscription.toJSON());
        // });
        
    }).catch(function(error) {
        console.log(':^(', error);
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