var webpush = require('web-push-encryption');
var Firebase = require('firebase');

var MY_GCM_KEY = "AIzaSyCsCOzXB8Ewo2XcM1_YTUkFTnmIPNKD95s"

webpush.setGCMAPIKey(MY_GCM_KEY);

// var subscription = {
//     endpoint: "https://android.googleapis.com/gcm/send/fb5WigvYycI:APA91bHtFqci2WbqYZyDGtTy4EL9z8wNrz_T910AknKElNHpcHBDTA_qvJr0RvmSpgvN5XKuebmEg5_pIFVnaXP1Il3tHmJW9KJAgz3E_V62zecuG9XRXOFbKcK_dHXuJNnnJSBws1uo",
//     keys: {
//         auth: "EeGppPrZgcYkreAsiofd2w==",
//         p256dh: "BM8iFNFfxSPIBflTVRewD7w_mi2woPhUj1OrtA5SDyeF75E7IJJ7fx81mc2h41al_6xtA6jGx7TaYIaXvxAOBIA="
//     }
// };

// sendPushMessage
function sendPushMessage(subscription) {
    if (subscription.endpoint.indexOf('https://android.googleapis.com/gcm/send/') === 0) {

        var data = JSON.stringify({
            data: "First push notification, PWA-TodoApp",
            title: "Title From Server",
            tag: "my-taggy",
            icon: "https://fs02.androidpit.info/a/10/3a/cornie-icons-103aff-w192.png" 
        });
        
        webpush.sendWebPush(data, subscription).then(function (resolve, reject) {
            if(reject){
                console.log('chrome reject: ', reject);    
            } else {
                console.log('chrome resolve: ', resolve);    
            }
        });

    }
} // sendPushMessage


var ref = new Firebase('https://pwa-todoapp.firebaseio.com/');
ref.child('user-push-notification').on('child_added', function(snapshot) {
    if(snapshot.val()) {
        sendPushMessage(snapshot.val());    
    }
});




