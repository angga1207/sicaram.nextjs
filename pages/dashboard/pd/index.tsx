import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import { faAngleDoubleDown, faBriefcase, faCartArrowDown, faChartLine, faClock, faExclamationTriangle, faExternalLinkAlt, faFileSignature, faGlobeAsia, faPercent, faProjectDiagram, faQuestionCircle, faSackDollar, faShare, faStar, faSuitcase, faTachometerAltAverage, faThumbsUp, faToolbox, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '@/components/Dropdown';
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
import IconCashBanknotes from '@/components/Icon/IconCashBanknotes';
import IconBolt from '@/components/Icon/IconBolt';
import IconBox from '@/components/Icon/IconBox';
import IconPlus from '@/components/Icon/IconPlus';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from "react";
// import CountUp from 'react-countup';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import IconCreditCard from '@/components/Icon/IconCreditCard';

import { getDetailInstance, getDetailProgram, getDetaiKegiatan, getDetailSubKegiatan } from '@/apis/fetchdashboard';
import { getMasterTujuan } from '@/apis/tujuan_sasaran';
import Link from 'next/link';
import { faFacebook, faSuperpowers, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { colors } from 'react-select/dist/declarations/src/theme';
import IconX from '@/components/Icon/IconX';
import { format } from 'path';
import LoadingSicaram from '@/components/LoadingSicaram';

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { faFileAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import DashboardOPD from './[slug]';

const Index = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard Perangkat Daerah'));
    });

    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
        if (isMounted) {
            setPeriode(JSON.parse(localStorage.getItem('periode') ?? ""));
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            const currentYear = new Date().getFullYear();
            if (periode?.start_year <= currentYear) {
                if (localStorage.getItem('year')) {
                    setYear(localStorage.getItem('year') ?? currentYear);
                } else {
                    setYear(currentYear);
                }
            } else {
                setYear(periode?.start_year)
            }
        }
    }, [isMounted, periode?.id]);

    return (
        <>
            <DashboardOPD />
        </>
    );
}

export default Index;
