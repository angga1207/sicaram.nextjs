import { useRouter } from "next/router";

import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const CurrentToken = getCookie('token');
// const BaseUri = 'https://simoedanep.in/api';
const BaseUri = 'https://sicaram.oganilirkab.go.id/api';


export async function fetchDashboardOPD(code: string, year: number, month: number) {
    const res = await axios.get(BaseUri + '/public/rka-pd/' + code + '?year=' + year + '&month=' + month, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CurrentToken}`,
        },
    });
    const data = await res.data;
    return data;
}
