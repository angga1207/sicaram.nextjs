import { useRouter } from "next/router";
import { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { BaseUri } from "./serverConfig";
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';
const baseUri = BaseUri();
const CurrentToken = getCookie('token');

export async function getSumberDana(search: string, page: number) {
    try {
        let uri = '';
        if (search) {
            uri = baseUri + '/ref-tag-sumber-dana?search=' + search + '&page=' + page;
        } else {
            uri = baseUri + '/ref-tag-sumber-dana?page=' + page;
        }
        const res = await axios.get(uri, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
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

export async function saveSumberDana(data: any) {
    try {
        const res = await axios.post(baseUri + '/ref-tag-sumber-dana', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}

export async function deleteSumberDana(id: number) {
    try {
        const res = await axios.delete(baseUri + '/ref-tag-sumber-dana/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            }
        });

        const returns = await res.data;
        return returns;

    } catch (error) {
        return {
            status: 'error',
            message: error
        }
    }
}
