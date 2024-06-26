import { useRouter } from "next/router";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { BaseUri } from "./serverConfig";


const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
// const BaseUri = 'https://sicaram.oganilirkab.go.id/api';
const baseUri = BaseUri();

export async function getRealisasiHead(instance: any, year: any) {
    const res = await axios.get(baseUri + '/report/realisasi-head', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        params: {
            instance: instance,
            year: year
        }
    });
    const data = await res.data;
    return data;
}

export async function getRealisasi(instance: any, year: any, triwulan: any) {
    const res = await axios.get(baseUri + '/report/realisasi', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
        params: {
            instance: instance,
            year: year,
            triwulan: triwulan
        }
    });
    const data = await res.data;
    return data;
}
