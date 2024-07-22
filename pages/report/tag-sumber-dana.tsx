import { setPageTitle } from "@/store/themeConfigSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dynamic from 'next/dynamic';
import { getReportTagSumberDana } from "@/apis/report_apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Page = () => {

    const [isMounted, setIsMounted] = useState(false);

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
    }, [isMounted]);

    const route = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Laporan Tag Sumber Dana'));
    });

    const [detail, setDetail] = useState<any>(null);
    const [dataPrograms, setDataPrograms] = useState<any>([]);
    const [dataKegiatans, setDataKegiatans] = useState<any>([]);
    const [dataSubKegiatans, setDataSubKegiatans] = useState<any>([]);
    const [datas, setDatas] = useState<any>([]);
    const [instance, setInstance] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [tag, setTag] = useState<any>(null);

    useEffect(() => {
        if (route.query) {
            const { instance, year, tag } = route.query;
            setInstance(instance);
            setYear(year);
            setTag(tag);
        }
    }, [route.query]);

    useEffect(() => {
        if (isMounted && instance && year && tag) {
            getReportTagSumberDana(instance, year, tag).then((res) => {
                if (res.status === 'success') {
                    setDetail(res?.data?.summary);

                    setDataPrograms(res?.data?.programs);
                    setDataKegiatans(res?.data?.kegiatans);
                    setDataSubKegiatans(res?.data?.sub_kegiatans);
                    setDatas(res?.data?.datas);
                }
                console.log(res);
            });
        }
    }, [isMounted, instance, year, tag, route.query])

    const tagSumberDanaChart: any = {
        series: datas?.map((data: any) => data?.total_anggaran),
        options: {
            chart: {
                height: 500,
                type: 'pie',
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
            },
            labels: datas?.map((data: any) => data?.tag),
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            stroke: {
                show: false,
            },
            legend: {
                position: 'left',
            },
            plotOptions: {
                pie: {
                    expandOnClick: true
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val: any) {
                        return 'Rp. ' + new Intl.NumberFormat('id-ID').format(val);
                    },
                },
            }
        },
    };

    const programChart: any = {
        series: [
            {
                name: 'Anggaran',
                // data: [44, 55, 41, 67, 22, 43, 21, 70],
                data: dataPrograms?.map((program: any) => program?.total_anggaran),
            },
        ],
        options: {
            chart: {
                // height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#008fce'],
            xaxis: {
                categories: dataPrograms?.map((program: any) => program?.name),
                axisBorder: {
                    color: '#191e3a',
                },
            },
            yaxis: {
                opposite: false,
                reversed: false,
                labels: {
                    formatter: function (val: any) {
                        return 'Rp. ' + new Intl.NumberFormat('id-ID').format(val);
                    },
                },
            },
            grid: {
                borderColor: '#191e3a',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 5,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                },
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    const kegiatanChart: any = {
        series: [
            {
                name: 'Anggaran',
                data: dataKegiatans?.map((kegiatan: any) => kegiatan?.total_anggaran),
            },
        ],
        options: {
            chart: {
                // height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#ce008f'],
            xaxis: {
                categories: dataKegiatans?.map((kegiatan: any) => kegiatan?.name),
                axisBorder: {
                    color: '#191e3a',
                },
            },
            yaxis: {
                opposite: false,
                reversed: false,
            },
            grid: {
                borderColor: '#191e3a',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 5,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                },
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    const subKegiatanChart: any = {
        series: [
            {
                name: 'Anggaran',
                data: dataSubKegiatans?.map((subKegiatan: any) => subKegiatan?.total_anggaran),
            },
        ],
        options: {
            chart: {
                // height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#8fce00'],
            xaxis: {
                categories: dataSubKegiatans?.map((subKegiatan: any) => subKegiatan?.name),
                axisBorder: {
                    color: '#191e3a',
                },
            },
            yaxis: {
                opposite: false,
                reversed: false,
            },
            grid: {
                borderColor: '#191e3a',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 5,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                },
            },
            fill: {
                opacity: 0.8,
            },
        },
    };

    return (
        <div className="">
            <div className="mb-5 flex gap-y-10 md:items-center flex-col md:flex-row md:justify-between">
                <h5 className="font-semibold text-5xl dark:text-white-light text-center">
                    Laporan Tag Sumber Dana
                    {detail?.tag ? '"' + detail?.tag + '"' : ''}
                </h5>

                <div className="self-end">
                    <button onClick={() => route.back()} className="btn btn-primary">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                        <span>
                            Kembali
                        </span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 md:col-span-6 panel">
                    <table>
                        <tbody>

                            <tr>
                                <td className="text-base w-[200px]">
                                    Sumber Dana
                                </td>
                                <th className="text-start text-md">
                                    {detail?.tag ?? ''}
                                </th>
                            </tr>

                            <tr>
                                <td className="text-base">
                                    Total Program
                                </td>
                                <th className="text-start text-md">
                                    {detail?.program_count ?? '0'}
                                </th>
                            </tr>

                            <tr>
                                <td className="text-base">
                                    Total Kegiatan
                                </td>
                                <th className="text-start text-md">
                                    {detail?.kegiatan_count ?? '0'}
                                </th>
                            </tr>

                            <tr>
                                <td className="text-base">
                                    Total Sub Kegiatan
                                </td>
                                <th className="text-start text-md">
                                    {detail?.sub_kegiatan_count ?? '0'}
                                </th>
                            </tr>

                            <tr>
                                <td className="text-base">
                                    Total Anggaran
                                </td>
                                <th className="text-start text-md">
                                    Rp. {new Intl.NumberFormat('id-ID').format(detail?.total_anggaran ?? 0)}
                                </th>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="text-lg font-semibold mb-5">
                        Chart Tag Sumber Dana
                    </div>
                    {isMounted ? (
                        <ReactApexChart series={tagSumberDanaChart.series}
                            options={tagSumberDanaChart.options}
                            className="rounded-lg bg-white dark:bg-black overflow-hidden" type="pie" height={400} />
                    ) : (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg h-[400px]"></div>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="text-lg font-semibold mb-5">
                        Daftar Program yang menggunakan Sumber Dana
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-[1px]">
                                        No
                                    </th>
                                    <th>
                                        Program
                                    </th>
                                    <th>
                                        Anggaran
                                    </th>
                                    <th>
                                        Tahun
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPrograms?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                )}

                                {dataPrograms?.map((program: any, index: number) => (
                                    <tr key={`list-program-${index}`}>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {program?.fullcode} - {program?.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                - {program?.instance_name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                Rp. {new Intl.NumberFormat('id-ID').format(program?.total_anggaran)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {program?.year}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="text-lg font-semibold mb-5">
                        Chart Program yang menggunakan Sumber Dana
                    </div>
                    {isMounted ? (
                        <ReactApexChart series={programChart.series} options={programChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" />
                    ) : (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg min-h-[400px]"></div>
                    )}
                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="text-lg font-semibold mb-5">
                        Daftar Kegiatan yang menggunakan Sumber Dana
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-[1px]">
                                        No
                                    </th>
                                    <th>
                                        Kegiatan
                                    </th>
                                    <th>
                                        Anggaran
                                    </th>
                                    <th>
                                        Tahun
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataKegiatans?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                )}

                                {dataKegiatans?.map((kegiatan: any, index: number) => (
                                    <tr key={`list-kegiatan-${index}`}>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="">
                                                {kegiatan?.fullcode} - {kegiatan?.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                - {kegiatan?.instance_name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                Rp. {new Intl.NumberFormat('id-ID').format(kegiatan?.total_anggaran)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {kegiatan?.year}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 panel">
                    <div className="text-lg font-semibold mb-5">
                        Chart Kegiatan yang menggunakan Sumber Dana
                    </div>
                    {isMounted ? (
                        <ReactApexChart series={kegiatanChart.series} options={kegiatanChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" />
                    ) : (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg min-h-[400px]"></div>
                    )}
                </div>

                <div className="col-span-12 panel">
                    <div className="text-lg font-semibold mb-5">
                        Daftar Sub Kegiatan yang menggunakan Sumber Dana
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-[1px]">
                                        No
                                    </th>
                                    <th>
                                        Sub Kegiatan
                                    </th>
                                    <th>
                                        Anggaran
                                    </th>
                                    <th>
                                        Tahun
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSubKegiatans?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                )}

                                {dataSubKegiatans?.map((subKegiatan: any, index: number) => (
                                    <tr key={`list-sub-kegiatan-${index}`}>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="">
                                                {subKegiatan?.fullcode} - {subKegiatan?.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                - {subKegiatan?.instance_name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                Rp. {new Intl.NumberFormat('id-ID').format(subKegiatan?.total_anggaran)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {subKegiatan?.year}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-12 panel">
                    <div className="text-lg font-semibold mb-5">
                        Chart Sub Kegiatan yang menggunakan Sumber Dana
                    </div>
                    {isMounted ? (
                        <ReactApexChart series={subKegiatanChart.series} options={subKegiatanChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={500} />
                    ) : (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg h-[500px]"></div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Page;
