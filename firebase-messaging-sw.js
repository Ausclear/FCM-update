// Firebase Cloud Messaging Service Worker
// This file must be named 'firebase-messaging-sw.js' and placed in the root of your project

console.log('🔧 Firebase Messaging Service Worker starting...');

// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

console.log('📦 Firebase scripts loaded in service worker');

// Initialize Firebase in service worker with your exact config
firebase.initializeApp({
    apiKey: "AIzaSyAByQ9hn2jzpl0vQ0YmI8yKkiEMlfNn_qk",
    authDomain: "ausclear-portal-4166a.firebaseapp.com",
    projectId: "ausclear-portal-4166a",
    storageBucket: "ausclear-portal-4166a.firebasestorage.app",
    messagingSenderId: "174515892387",
    appId: "1:174515892387:web:bbc901582ed4b6a24dcf16"
});

console.log('🔥 Firebase initialized in service worker');

const messaging = firebase.messaging();

console.log('📨 Messaging instance created in service worker');

// Handle background messages (when the app is not in focus)
messaging.onBackgroundMessage(function(payload) {
    console.log('📨 Background Message received in service worker:', payload);
    
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'AusClear Message';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message from AusClear',
        icon: payload.notification?.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'ausclear-message',
        requireInteraction: true,
        data: payload.data || {},
        actions: [
            {
                action: 'view',
                title: 'View Message'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    console.log('🔔 Showing background notification:', notificationTitle);
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    console.log('👆 Notification clicked:', event.notification.tag);
    event.notification.close();
    
    if (event.action === 'view') {
        // Handle view action
        console.log('📖 View action clicked');
    } else if (event.action === 'dismiss') {
        // Handle dismiss action
        console.log('❌ Dismiss action clicked');
        return;
    }
    
    // Focus or open the app window
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            // If the app is already open, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Handle push events (alternative to onBackgroundMessage)
self.addEventListener('push', function(event) {
    console.log('📨 Push event received:', event);
    
    if (event.data) {
        const payload = event.data.json();
        console.log('📊 Push payload:', payload);
        
        const notificationTitle = payload.notification?.title || 'AusClear Notification';
        const notificationOptions = {
            body: payload.notification?.body || 'You have a new notification',
            icon: payload.notification?.icon || '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'ausclear-push',
            requireInteraction: true,
            data: payload.data || {}
        };
        
        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
});

console.log('✅ Firebase Messaging Service Worker setup complete');
