
import { faAngleDoubleRight, faArrowLeft, faArrowUpRightDots, faCartArrowDown, faClipboardCheck, faCoins, faExclamationTriangle, faLink, faMoneyBills, faMoneyCheckAlt, faTags, faThumbsUp, faTree } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import IconMenuWidgets from './Icon/Menu/IconMenuWidgets';
import IconMenuTodo from './Icon/Menu/IconMenuTodo';
import IconMenuInvoice from './Icon/Menu/IconMenuInvoice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import IconBolt from './Icon/IconBolt';

const MainMenu = () => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    const [mainMenu, setMainMenu] = useState<any>();
    const [selectedMenu, setSelectedMenu] = useState<any>(null);

    useEffect(() => {
        if (isMounted) {
            setMainMenu([
                {
                    id: 1,
                    name: 'Master Urusan',
                    icon: <IconMenuWidgets className='w-10 h-10 text-success' />,
                    url: '#',
                    active: true,
                    roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                    childs: [
                        {
                            name: 'Master Urusan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/urusan/'
                        },
                        {
                            name: 'Master Bidang Urusan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/bidang/'
                        },
                        {
                            name: 'Master Program',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/program/'
                        },
                        {
                            name: 'Master Kegiatan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/kegiatan/'
                        },
                        {
                            name: 'Master Sub Kegiatan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                            url: '/master/subkegiatan/'
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Indikator Kinerja',
                    icon: <IconMenuTodo className='w-10 h-10 text-success' />,
                    url: '#',
                    active: true,
                    roles: [1, 2, 3, 4, 5, 9],
                    childs: [
                        {
                            name: 'Indikator Kegiatan',
                            roles: [1, 2, 3, 4, 5, 9],
                            url: '/master/indikator-kinerja/kegiatan'
                        },
                        {
                            name: 'Indikator Sub Kegiatan',
                            roles: [1, 2, 3, 4, 5, 9],
                            url: '/master/indikator-kinerja/sub-kegiatan'
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'Kode Rekening',
                    icon: <IconMenuInvoice className='w-10 h-10 text-success' />,
                    url: '#',
                    active: true,
                    roles: [1, 2, 3, 4, 6, 7],
                    childs: [
                        {
                            name: 'Daftar Rekening',
                            roles: [1, 2, 4, 7],
                            url: '/rekening'
                        },
                        {
                            name: 'Sumber Dana',
                            roles: [1, 2, 3, 4, 6, 7],
                            url: '/sumber-dana'
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Referensi',
                    roles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    icon: <IconMenuWidgets className='w-10 h-10 text-success' />,
                    url: '#',
                    active: true,
                    childs: [
                        {
                            name: 'Periode',
                            roles: [1, 2],
                            url: '/reference/periode'
                        },
                        {
                            name: 'Satuan',
                            roles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            url: '/reference/satuan'
                        },
                        {
                            name: 'Tag Sumber Dana',
                            roles: [1, 2, 3, 4],
                            url: '/reference/tag-sumber-dana'
                        },
                        {
                            name: 'Tujuan & Sasaran',
                            roles: [1, 2, 3, 6],
                            url: '/reference/tujuan-sasaran'
                        },
                        {
                            name: 'Indikator Tujuan & Sasaran',
                            roles: [1, 2, 3, 6],
                            url: '/reference/indikator-tujuan-sasaran'
                        },
                    ],
                },
                {
                    id: 5,
                    name: 'Tujuan & Sasaran',
                    roles: [1, 2, 3, 6, 9],
                    icon: <FontAwesomeIcon icon={faArrowUpRightDots} className='w-10 h-10 text-success' />,
                    url: '#',
                    active: true,
                    childs: [
                        {
                            name: 'Master Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/master/tujuan-sasaran'
                        },
                        {
                            name: 'Target Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/target/tujuan-sasaran'
                        },
                        {
                            name: 'Target Perubahan Tujuan Sasaran Kabupaten',
                            roles: [1, 2, 3, 6],
                            url: '/target/perubahan/tujuan-sasaran'
                        },
                        {
                            name: 'Master Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/master/tujuan-sasaran/perangkat-daerah'
                        },
                        {
                            name: 'Target Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/target/tujuan-sasaran/perangkat-daerah'
                        },
                        {
                            name: 'Target Perubahan Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/target/perubahan/tujuan-sasaran-perangkat-daerah'
                        },
                    ],
                },
                {
                    id: 6,
                    name: 'Pohon Kinerja',
                    roles: [1, 2, 3, 6, 9],
                    icon: <FontAwesomeIcon icon={faTree} className='w-10 h-10 text-success' />,
                    url: '/pohon-kinerja',
                    active: true,
                    childs: [],
                },
                {
                    id: 7,
                    name: 'Tagging Sumber Dana',
                    roles: [1, 2, 4, 7, 9],
                    icon: <FontAwesomeIcon icon={faTags} className='w-8 h-8 text-success' />,
                    url: '/tagging-sumber-dana',
                    active: true,
                    childs: [],
                },
                {
                    id: 8,
                    name: 'RPJMD',
                    roles: [1, 2, 4, 7, 9],
                    icon: <FontAwesomeIcon icon={faMoneyCheckAlt} className='w-10 h-10 text-success' />,
                    url: '/rpjmd',
                    active: true,
                    childs: [],
                },
                {
                    id: 9,
                    name: 'Renstra Induk',
                    roles: [1, 2, 4, 7, 9],
                    icon: <FontAwesomeIcon icon={faCoins} className='w-8 h-8 text-success' />,
                    url: '/renstra',
                    active: true,
                    childs: [],
                },
                {
                    id: 10,
                    name: 'Renstra Perubahan',
                    roles: [1, 2, 4, 7, 9],
                    icon: <FontAwesomeIcon icon={faCoins} className='w-8 h-8 text-success' />,
                    url: '/renja',
                    active: true,
                    childs: [],
                },
                {
                    id: 11,
                    name: 'Akuntansi',
                    roles: [1, 2, 4, 9, 12],
                    icon: <FontAwesomeIcon icon={faMoneyBills} className='w-9 h-9 text-success' />,
                    url: '/accountancy',
                    active: true,
                    childs: [],
                },
                {
                    id: 12,
                    name: 'Realisasi',
                    roles: [1, 2, 3, 4, 6, 7, 9],
                    icon: <FontAwesomeIcon icon={faClipboardCheck} className='w-8 h-8 text-success' />,
                    url: '#',
                    active: true,
                    childs: [
                        {
                            name: 'Realisasi Program',
                            roles: [1, 2, 3, 4, 6, 7, 9],
                            url: '/kinerja'
                        },
                        {
                            name: 'Realisasi Tujuan Sasaran',
                            roles: [1, 2, 3, 6, 9],
                            url: '/realisasi/tujuan-sasaran'
                        },
                        {
                            name: 'Realisasi Tujuan Sasaran Perangkat Daerah',
                            roles: [1, 2, 3, 6, 9],
                            url: '/realisasi/tujuan-sasaran-perangkat-daerah'
                        },
                    ],
                },
            ]);
        }
    }, [isMounted])

    return (
        <>

            {!selectedMenu && (
                <div className="grid grid-cols-2 md:grid-cols-4 justify-start items-start gap-2 h-[500px] overflow-y-auto overflow-x-hidden pr-4 pb-4 pl-1 pt-1">
                    {mainMenu?.map((item: any, index: number) => (
                        <>
                            {item.url == '#' && (
                                <div className={`transition-all duration-300 cursor-pointer hover:text-success w-full flex items-center justify-center`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedMenu(item);
                                    }}
                                >
                                    <div className="flex items-center justify-center flex-col">
                                        {item.icon}
                                        <div className='mt-2 font-semibold text-md text-center'>
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {item.url != '#' && (
                                <Link href={item.url} className={`transition-all duration-300 cursor-pointer hover:text-success w-full flex items-center justify-center`}>
                                    <div className="flex items-center justify-center flex-col">
                                        {item.icon}
                                        <div className='mt-2 font-semibold text-lg text-center'>
                                            {item.name}
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </>
                    ))}
                </div>
            )}

            {selectedMenu && (
                <div>
                    <div className="panel bg-green-100 py-2 cursor-pointer flex items-center justify-between gap-x-2 group"
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedMenu(null);
                        }}>
                        <div className="flex items-center justify-between gap-x-2">
                            {selectedMenu.icon}
                            <div className='font-semibold text-xl text-center text-success'>
                                {selectedMenu.name}
                            </div>
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faArrowLeft} className='w-5 h-5 text-success group-hover:mr-3 transition-all duration-300' />
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {selectedMenu?.childs?.map((item: any, index: number) => (
                            <div>
                                <Link href={item.url ?? '#'} className="">
                                    <div className="panel transition-all duration-300 cursor-pointer hover:bg-blue-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-2">
                                            <IconBolt className='w-5 h-5 text-primary' />
                                            <div>
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className="">
                                            <FontAwesomeIcon icon={faLink} className='w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300' />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
};

export default MainMenu;
