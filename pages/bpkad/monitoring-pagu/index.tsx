import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/store/themeConfigSlice";
import { BaseUri } from "@/apis/serverConfig";
import { useSession } from "next-auth/react";
import axios from "axios";
import DisplayMoney from "@/components/DisplayMoney";
import Link from "next/link";
import Select from 'react-select';
import Swal from "sweetalert2";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { fetchMonitorPagu } from "@/apis/fetchbpkad";
import { Player } from "@lottiefiles/react-lottie-player";

const showAlert = async (icon: any, text: any) => {
    const toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        showCancelButton: false,
    });
    toast.fire({
        icon: icon,
        title: text,
        padding: '10px 20px',
    });
};

const Page = () => {


    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageTitle('Monitoring Pagu'));
    });


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    })

    const [CurrentUser, setCurrentUser] = useState<any>([]);
    const [periode, setPeriode] = useState<any>({});
    const [year, setYear] = useState<any>(null)

    useEffect(() => {
        if (document.cookie) {
            let user = document.cookie.split(';').find((row) => row.trim().startsWith('user='))?.split('=')[1];
            user = user ? JSON.parse(user) : null;
            setCurrentUser(user);
        }
        if (isMounted) {
            const localPeriode = localStorage.getItem('periode');
            if (localPeriode) {
                setPeriode(JSON.parse(localPeriode ?? ""));
            }
        }
    }, [isMounted]);

    const [instanceId, setInstanceId] = useState<any>((router.query.instance ?? null) ?? CurrentUser?.instance_id);
    const [instance, setInstance] = useState<any>(null);
    const [months, setMonths] = useState<any>([
        { id: 1, name: 'Januari' },
        { id: 2, name: 'Februari' },
        { id: 3, name: 'Maret' },
        { id: 4, name: 'April' },
        { id: 5, name: 'Mei' },
        { id: 6, name: 'Juni' },
        { id: 7, name: 'Juli' },
        { id: 8, name: 'Agustus' },
        { id: 9, name: 'September' },
        { id: 10, name: 'Oktober' },
        { id: 11, name: 'November' },
        { id: 12, name: 'Desember' },
    ]);

    useEffect(() => {
        if (router.query) {
            const { instance, year, month } = router.query;
            if (!CurrentUser?.instance_id) {
                setInstanceId(instance);
                setInstance(instance);
            }
            setYear(year);
        }
    }, [router.query]);

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (isMounted && session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [isMounted, session]);

    const fetchRefs = async () => {
        const response = await axios.get(`${BaseUri()}/report/getRefs`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${CurrentToken}`
            },
            params: {
                periode_id: periode?.id,
            }
        });
        const data = await response.data;
        return data;
    }

    const [years, setYears] = useState<any>(null);
    const [instances, setInstances] = useState<any>([]);

    useEffect(() => {
        if (isMounted && periode?.id) {
            fetchRefs().then((data) => {
                if (data.status == 'success') {
                    setInstances(data.data.instances);
                    setYears(data.data.periodeRange.years);
                } else if (data.status == 'error') {
                    showAlert('error', data.message);
                } else {
                    showAlert('error', 'Terjadi kesalahan');
                }
            });
        }
    }, [isMounted, periode?.id]);

    const [isFetching, setIsFetching] = useState(false)
    const [datas, setDatas] = useState<any>([]);

    useEffect(() => {
        if (isMounted && instanceId && year && periode?.id) {
            setIsFetching(true);
            setDatas([]);
            fetchMonitorPagu(periode?.id, instanceId, year).then((data) => {
                if (data.status == 'success') {
                    setIsFetching(false);
                    setDatas(data.data);
                } else if (data.status == 'error') {
                    setIsFetching(false);
                    setDatas([]);
                    showAlert('error', data.message);
                } else {
                    setIsFetching(false);
                    setDatas([]);
                    showAlert('error', 'Terjadi kesalahan');
                }
            }).catch((error) => {
                setIsFetching(false);
                setDatas([]);
                showAlert('error', 'Terjadi kesalahan');
            });
        }
    }, [isMounted, instanceId, year, periode?.id]);

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-4 gap-x-2">
                <div className="">
                    <div className="flex items-center gap-x-2 mb-2">
                        <div className="shrink-0 whitespace-nowrap w-[150px]">
                            PERANGKAT DAERAH
                        </div>
                        <div>
                            :
                        </div>
                        <div className="">
                            <Select placeholder="Pilih Perangkat Daerah"
                                className='w-[368px]'
                                onChange={(e: any) => {
                                    if ([9].includes(CurrentUser?.role_id)) {
                                        showAlert('error', 'Anda tidak memiliki akses ke Perangkat Daerah ini');
                                        return;
                                    } else {
                                        setInstance(e?.value);
                                        router.query.instance = e?.value;
                                        router.push(router);
                                    }
                                }}
                                isDisabled={[9].includes(CurrentUser?.role_id) ? true : (isFetching ?? false)}
                                value={
                                    instances?.map((data: any, index: number) => {
                                        if (data.id == instanceId) {
                                            return {
                                                value: data.id,
                                                label: data.name,
                                            }
                                        }
                                    })
                                }
                                options={
                                    instances?.map((data: any, index: number) => {
                                        return {
                                            value: data.id,
                                            label: data.name,
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2 mb-2">
                        <div className="flex items-center gap-x-2">
                            <div className="shrink-0 w-[150px]">
                                TAHUN
                            </div>
                            <div className="uppercase">
                                :
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="">
                                <Select placeholder="Pilih Tahun"
                                    className='w-[180px]'
                                    isDisabled={(isFetching ?? false)}
                                    onChange={(e: any) => {
                                        // setYear(e?.value);
                                        router.query.year = e?.value;
                                        router.push(router);
                                    }}
                                    value={
                                        years?.map((data: any, index: number) => {
                                            if (data == year) {
                                                return {
                                                    value: data,
                                                    label: data,
                                                }
                                            }
                                        })
                                    }
                                    options={
                                        years?.map((data: any, index: number) => {
                                            return {
                                                value: data,
                                                label: data,
                                            }
                                        })
                                    } />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grow">
                    <div className="text-xl font-bold text-center mb-2">
                        Monitoring Pagu <br />
                        Sicaram {`><`} SIPD
                    </div>
                </div>
            </div>

            <hr className="my-3" />


            {isFetching && (
                <div className="w-full h-[calc(100vh-400px)] flex items-center justify-center">
                    <Player
                        autoplay
                        loop
                        src="/lottie/bpkad-2.json"
                        className='w-[300px] h-[300px] group-hover:scale-125 transition-all duration-500'
                    >
                    </Player>
                </div>
            )}

            {!isFetching && (
                <div className="table-responsive">
                    <table className="table-hover">
                        <thead className="sticky top-0 bg-slate-800 text-white">
                            <tr>
                                <th
                                    rowSpan={2}
                                    className="text-center min-w-[300px] bg-slate-800 text-white border border-white sticky top-0 left-0 z-1">
                                    Program / Kegiatan / Sub Kegiatan
                                </th>
                                {months.map((data: any, index: number) => (
                                    <th
                                        key={`head-month-${index}`}
                                        colSpan={6}
                                        className="text-center min-w-[100px] bg-slate-800 text-white border border-white">
                                        {data.name}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {months.map((data: any, index: number) => (
                                    <>
                                        <th
                                            key={`head-month-pagu-induk-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Pagu Induk
                                        </th>
                                        <th
                                            key={`head-month-pagu-pergeseran-1-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Pergeseran 1
                                        </th>
                                        <th
                                            key={`head-month-pagu-pergeseran-2-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Pergeseran 2
                                        </th>
                                        <th
                                            key={`head-month-pagu-pergeseran-3-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Pergeseran 3
                                        </th>
                                        <th
                                            key={`head-month-pagu-pergeseran-4-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Pergeseran 4
                                        </th>
                                        <th
                                            key={`head-month-pagu-perubahan-${index}`}
                                            className="text-center text-xs whitespace-nowrap min-w-[100px] bg-slate-800 text-white border border-white">
                                            Perubahan
                                        </th>
                                    </>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {!isFetching && datas?.length == 0 && (
                                <tr>
                                    <td colSpan={months.length * 6 + 1} className="text-center">
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}

                            {datas?.map((data: any, index: number) => (
                                <tr key={`body-data-${index}`} className="cursor-pointer">
                                    <td className="text-start min-w-[300px] bg-white border border-slate-300 sticky top-0 left-0 z-1">
                                        <div className="text-xs text-slate-500">
                                            {data?.fullcode}
                                        </div>
                                        <div>
                                            {data?.name}
                                        </div>
                                    </td>

                                    {months.map((month: any, index: number) => (
                                        <>
                                            <td
                                                key={`body-data-pagu-induk-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300 bg-slate-100">
                                                <DisplayMoney data={data?.data?.[index]?.pagu_induk} />
                                            </td>
                                            <td
                                                key={`body-data-pagu-pergeseran-1-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300">
                                                <Tippy content={data?.data?.[index]?.tanggal_pergeseran_1 ?
                                                    new Date(data?.data?.[index]?.tanggal_pergeseran_1).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    }) : 'Tidak ada data'} placement="top">
                                                    <div>
                                                        <DisplayMoney data={data?.data?.[index]?.pagu_pergeseran_1} />
                                                    </div>
                                                </Tippy>
                                            </td>
                                            <td
                                                key={`body-data-pagu-pergeseran-2-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300 bg-slate-100">
                                                <Tippy content={data?.data?.[index]?.tanggal_pergeseran_2 ?
                                                    new Date(data?.data?.[index]?.tanggal_pergeseran_2).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    }) : 'Tidak ada data'} placement="top">
                                                    <div>
                                                        <DisplayMoney data={data?.data?.[index]?.pagu_pergeseran_2} />
                                                    </div>
                                                </Tippy>
                                            </td>
                                            <td
                                                key={`body-data-pagu-pergeseran-3-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300">
                                                <Tippy content={data?.data?.[index]?.tanggal_pergeseran_3 ?
                                                    new Date(data?.data?.[index]?.tanggal_pergeseran_3).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    }) : 'Tidak ada data'} placement="top">
                                                    <div>
                                                        <DisplayMoney data={data?.data?.[index]?.pagu_pergeseran_3} />
                                                    </div>
                                                </Tippy>
                                            </td>
                                            <td
                                                key={`body-data-pagu-pergeseran-4-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300 bg-slate-100">
                                                <Tippy content={data?.data?.[index]?.tanggal_pergeseran_4 ?
                                                    new Date(data?.data?.[index]?.tanggal_pergeseran_4).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    }) : 'Tidak ada data'} placement="top">
                                                    <div>
                                                        <DisplayMoney data={data?.data?.[index]?.pagu_pergeseran_4} />
                                                    </div>
                                                </Tippy>
                                            </td>
                                            <td
                                                key={`body-data-pagu-perubahan-${index}`}
                                                className="text-center whitespace-nowrap border border-slate-300">
                                                <Tippy content={data?.data?.[index]?.tanggal_perubahan ?
                                                    new Date(data?.data?.[index]?.tanggal_perubahan).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit'
                                                    }) : 'Tidak ada data'} placement="top">
                                                    <div>
                                                        <DisplayMoney data={data?.data?.[index]?.pagu_perubahan} />
                                                    </div>
                                                </Tippy>
                                            </td>
                                        </>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default Page;
