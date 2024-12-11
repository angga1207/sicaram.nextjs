import Select from 'react-select';
import { faPlus, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { deleteBarjasKeAset, getBarjasKeAset, storeBarjasKeAset } from '@/apis/Accountancy/PenyesuaianAsetDanBeban';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '@/components/Icon/IconTrash';
import { Tab } from '@headlessui/react';
import MutasiAset from './KertasKerjaTambahan/MutasiAset';
import DaftarPekerjaanKontrak from './KertasKerjaTambahan/DaftarPekerjaanKontrak';
import HibahMasuk from './KertasKerjaTambahan/HibahMasuk';
import HibahKeluar from './KertasKerjaTambahan/HibahKeluar';


const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const KertasKerjaTambahan = (data: any) => {
    const paramData = data.data
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [CurrentToken, setCurrentToken] = useState<any>(null);
    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);

            let token = document.cookie.split(';').find((row) => row.trim().startsWith('token='))?.split('=')[1];
            setCurrentToken(token);
        }
        // if (isMounted) {
        //     const localPeriode = localStorage.getItem('periode');
        //     if (localPeriode) {
        //         setPeriode(JSON.parse(localPeriode ?? ""));
        //     }
        // }
        setPeriode(paramData[2]);
        setYear(paramData[3]);
    }, [isMounted]);

    const [instance, setInstance] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instances, setInstances] = useState<any>([]);
    const [arrKodeRekening, setArrKodeRekening] = useState<any>([])

    useEffect(() => {
        if (paramData[0]?.length > 0) {
            setInstances(paramData[0]);
        }
    }, [isMounted, paramData]);

    useEffect(() => {
        if (paramData[1]?.length > 0) {
            setArrKodeRekening(paramData[1])
        }
        if (paramData[4]) {
            setInstance(paramData[4]);
        }
    }, [isMounted, paramData]);

    const [dataInput, setDataInput] = useState<any>([]);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <>
            <Tab.Group>
                <Tab.List className="mt-3 flex flex-nowrap border-b border-white-light dark:border-[#191e3a overflow-x-auto border">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`font-semibold p-4 flex-grow whitespace-nowrap border ${selected ? 'text-primary bg-primary-light !outline-none' : 'bg-slate-100 dark:bg-slate-800'} -mb-[1px] block hover:text-primary`}>
                                Mutasi Aset
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`font-semibold p-4 flex-grow whitespace-nowrap border ${selected ? 'text-primary bg-primary-light !outline-none' : 'bg-slate-100 dark:bg-slate-800'} -mb-[1px] block hover:text-primary`}>
                                Daftar Pekerjaan (Kontrak)
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`font-semibold p-4 flex-grow whitespace-nowrap border ${selected ? 'text-primary bg-primary-light !outline-none' : 'bg-slate-100 dark:bg-slate-800'} -mb-[1px] block hover:text-primary`}>
                                Hibah Masuk
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`font-semibold p-4 flex-grow whitespace-nowrap border ${selected ? 'text-primary bg-primary-light !outline-none' : 'bg-slate-100 dark:bg-slate-800'} -mb-[1px] block hover:text-primary`}>
                                Hibah Keluar
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="active pt-5">
                            {(isMounted && instances.length > 0) && (
                                <MutasiAset
                                    data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                    key={[year, instance]}
                                />
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            {(isMounted && instances.length > 0) && (
                                <DaftarPekerjaanKontrak
                                    data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                    key={[year, instance]}
                                />
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            {(isMounted && instances.length > 0) && (
                                <HibahMasuk
                                    data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                    key={[year, instance]}
                                />
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            {(isMounted && instances.length > 0) && (
                                <HibahKeluar
                                    data={isMounted && [instances, arrKodeRekening, periode, year, instance]}
                                    key={[year, instance]}
                                />
                            )}
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    );
}

export default KertasKerjaTambahan;
