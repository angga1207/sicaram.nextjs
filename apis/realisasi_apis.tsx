import { useRouter } from "next/router";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosRequestConfig } from "axios";
import { BaseUri } from "./serverConfig";

const baseUri = BaseUri();

var FormData = require('form-data');
const CurrentToken = getCookie('token');

export async function getMasterData(id: any, year: any, month: any) {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                year: year,
                month: month
            }
        });
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function SaveRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/' + id, {
            data: datas,
            periode: periode,
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function SaveRincianRealisasi(id: any, datas: any, periode: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/detail', {
            data: datas,
            periode: periode,
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        // console.log(res);
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function fetchLogs(id: any, year: any, month: any) {
    try {
        const res = await axios.get(baseUri + '/caram/realisasi/' + id + '/logs', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            },
            params: {
                year: year,
                month: month
            }
        });
        const data = await res.data;
        return data;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function sendRequestVerification(id: any, data: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/logs', {
            message: data?.message,
            status: 'sent',
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const returns = await res.data;
        return returns;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}

export async function sendReplyVerification(id: any, data: any, year: any, month: any) {
    try {
        const res = await axios.post(baseUri + '/caram/realisasi/' + id + '/logs', {
            message: data?.message,
            status: data?.status,
            year: year,
            month: month
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`,
            }
        });
        const returns = await res.data;
        return returns;
    } catch (error) {
        return {
            status: 'no instance'
        }
    }
}
