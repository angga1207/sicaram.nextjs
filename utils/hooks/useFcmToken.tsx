import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../firebase/firebase';

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] =
        useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Retrieve the notification permission status
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    // Check if permission is granted before retrieving the token
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey:
                                'BN1QFK93Vrj9yIfH_2P8ZrhA8iQZYm7v2jsybZf2cYjHy7YCWhKiITvii8jTZlwpvX_CmT2xncCYiHYyt2r-3uQ',
                        });
                        if (currentToken) {
                            setToken(currentToken);
                        } else {
                            console.log(
                                'No registration token available. Request permission to generate one.'
                            );
                        }
                    }
                }
            } catch (error) {
                console.log('An error occurred while retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
