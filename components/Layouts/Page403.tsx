import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import { toggleLocale, toggleTheme, toggleSidebar, toggleRTL } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';

const Page403 = () => {
    return (
        <>
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-slate-500 dark:text-slate-400">
                        403
                    </div>
                    <div className="text-2xl font-medium text-slate-600 dark:text-slate-400">
                        Forbidden
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                        You are not allowed to access this page!
                    </div>
                    <div className="mt-5">
                        <Link href="/">
                            <div className="btn btn-outline-primary">
                                Back to Home
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page403;
