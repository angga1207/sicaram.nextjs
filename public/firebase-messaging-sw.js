// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAjbIbcFxoLKrE7U7EEzLckwXw8X2kYp78",
    authDomain: "sicaram-next-js.firebaseapp.com",
    projectId: "sicaram-next-js",
    storageBucket: "sicaram-next-js.appspot.com",
    messagingSenderId: "1027188997148",
    appId: "1:1027188997148:web:519aa1ec6e5e0b0e43f3d9",
    measurementId: "G-31MMCY34CF"
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './logo.png',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
