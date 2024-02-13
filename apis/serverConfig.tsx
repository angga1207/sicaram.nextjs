import { useRouter } from "next/router";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, set } from "lodash";
// import axios from 'axios';
import axios, { AxiosRequestConfig } from "axios";
const CurrentToken = getCookie('token');

export function BaseUri() {
    // const uri = 'https://sicaram.oganilirkab.go.id/api';
    const uri = 'http://127.0.0.1:8000/api';
    return uri;
}

export async function serverCheck() {
    try {
        const res = await axios.post(BaseUri() + '/bdsm', {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        })
        const data = await res.data;

        if (data.status == 'success') {
            if (data.data.user == null) {
                window.location.href = '/login';
            }
            localStorage.setItem('user', JSON.stringify(data?.data?.user));
        }

        return data;
    } catch (error) {
        console.log(error)
    }
}

