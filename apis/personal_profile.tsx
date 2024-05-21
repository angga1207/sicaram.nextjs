import { useRouter } from "next/router";
import { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';

const baseUri = BaseUri();
const CurrentToken = getCookie('token');



export async function fetchUserMe() {
    try {
        const res = await axios.get(baseUri + '/users-me', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchLogs(page: number = 1) {
    try {
        const res = await axios.get(baseUri + '/users-me/logs?page=' + page, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchNotifLess() {
    try {
        const res = await axios.get(baseUri + '/users-me/notifications-less', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function fetchNotif(page: number = 1) {
    try {
        const res = await axios.get(baseUri + '/users-me/notifications', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                page: page
            }
        });
        const data = res.data;
        return data;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function markNotifAsRead(id: string) {
    try {
        const res = await axios.get(baseUri + '/users-me/mark-notif-as-read/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        return res;
    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function postSavePassword(data: any) {
    try {
        const response = await axios.post(`${baseUri}/users-me/save-password`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
        });
        return response.data;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
