import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, Suspense, useState } from 'react';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { Provider } from 'react-redux';
import store from '../store/index';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';

import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';
import { NextPage } from 'next';

import React, { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase/firebase';
import useFcmToken from '@/utils/hooks/useFcmToken';
import Swal from 'sweetalert2';
import { BaseUri } from '@/apis/serverConfig';
import IconX from '@/components/Icon/IconX';

const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 5000,
        timerProgressBar: true,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
    const { fcmToken, notificationPermissionStatus } = useFcmToken();

    const baseUri = BaseUri();

    useEffect(() => {
        const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '{[]}') : [];
        const currentToken = localStorage.getItem('token') ?? null;
        if (currentUser && currentToken) {
            fetch(baseUri + '/users/' + currentUser?.id + '/fcm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentToken}`,
                },
                body: JSON.stringify({
                    fcmToken: fcmToken,
                }),
            })
                .then((response) => {
                })
                .then((data) => {
                })
                .catch((error) => {
                });
        }
        if (notificationPermissionStatus === 'denied') {
            showAlert('warning', 'Aktifkan notifikasi untuk mendapatkan informasi terbaru');
        }
    }, [fcmToken]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                // showAlert('info', payload?.notification?.body);
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);


    const [notifications, setNotifications] = useState<any>([]);

    useEffect(() => {

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const saveNotif = onMessage(messaging, (payload: any) => {
                const newMessage = {
                    title: payload.notification.title,
                    body: payload.notification.body,
                };
                if (notifications?.length > 5) {
                    setNotifications((notifications: any) => [...notifications.slice(1), newMessage]);
                }
                else {
                    setNotifications((notifications: any) => [...notifications, newMessage]);
                }

                // play sound
                const audio = new Audio('/assets/audio/notification.mp3');
                audio.volume = 1;
                audio.play();


                // remove notification after 5 seconds popup
                // setTimeout(() => {
                //     removeNotif(notifications.length - 1);
                // }, 5000);
            });
            return () => {
                saveNotif(); // triggerNotif from the onMessage event
            };
        }
    }, []);

    const removeNotif = (index: any) => {
        const newNotif = [...notifications];
        newNotif.splice(index, 1);
        setNotifications(newNotif);
    }

    return (
        <Provider store={store}>
            <Head>
                <title>SICARAM KABUPATEN OGAN ILIR</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.png" />

                <style>
                    {`
                       .grecaptcha-badge {
                        position: relative !important;
                        left: 0px !important;
                        top: 0px !important;

                            // visibility: hidden;
                    }
                    `}
                </style>
            </Head>

            <div className="fixed bottom-[20px] right-[30px] z-[61] bg-transparent w-[350px]">
                <div className="w-full h-full flex flex-col-reverse justify-end gap-y-3">

                    {notifications?.map((notif: any, index: any) => (
                        <div key={`notif-${index}`} className="panel px-3 py-2">
                            <div className="flex items-center justify-between">
                                <div className="">
                                    <div className="text-sm font-semibold dark:text-white">
                                        {notif.title}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-slate-500">
                                        {notif.body}
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        removeNotif(index)
                                    }}
                                    className="cursor-pointer dark:text-white hover:text-danger dark:hover:text-danger">
                                    <IconX className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
            {getLayout(<Component {...pageProps} />)}
        </Provider>
    );
};
export default appWithI18Next(App, ni18nConfig);
