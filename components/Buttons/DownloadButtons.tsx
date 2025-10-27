import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../Dropdown";
import { faArrowUpFromBracket, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BaseUri } from "@/apis/serverConfig";
import axios from "axios";
import { faFileExcel } from "@fortawesome/free-regular-svg-icons";
const baseUri = BaseUri();

const DownloadButtons = ({
    data, endpoint, uploadEndpoint = '', params, onClick, afterClick, isDisabled = false
}: {
    data: any, endpoint: string, uploadEndpoint?: string, params: any, onClick?: any, afterClick: any, isDisabled?: boolean
}) => {

    const [CurrentToken, setCurrentToken] = useState<any>(null);
    const session = useSession();
    useEffect(() => {
        if (session.status === 'authenticated') {
            const token = session?.data?.user?.name;
            setCurrentToken(token);
        }
    }, [session]);

    const handleDownload = async () => {
        try {
            const response = await axios.post(baseUri + endpoint, {
                data: data,
                params,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CurrentToken}`,
                },
            });

            if (response.data.status !== 'success') {
                afterClick(['error', response.data.message]);
                return;
            }

            const url = window.URL.createObjectURL(new Blob([response.data.data.path]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'true');
            link.setAttribute('href', response.data.data.path);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            afterClick(['success', 'Downloaded']);
        } catch (err) {
            afterClick(['error', err]);
            console.log(err);
        }
    }

    const handleUpload = () => {
        if (!uploadEndpoint) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('params', JSON.stringify(params));
            try {
                const response = await axios.post(baseUri + uploadEndpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${CurrentToken}`,
                    },
                });
                if (response.data.status === 'success') {
                    afterClick(['success', 'Uploaded']);
                } else {
                    afterClick(['error', response.data.message]);
                }
            } catch (err) {
                afterClick(['error']);
                console.log(err);
            }
        };
        input.click();
    }

    return (
        <div className="dropdown">
            <Dropdown
                placement='top-end'
                btnClassName="btn btn-outline-info dropdown-toggle inline-flex"
                button={
                    <>
                        Excel
                        <FontAwesomeIcon icon={faFileExcel} className="w-4 h-4 ml-2" />
                    </>
                }
            >
                <ul className="!min-w-[170px]">
                    {uploadEndpoint && (
                        <li>
                            <button
                                onClick={handleUpload}
                                className="flex items-center"
                                type="button">
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-4 h-4 mr-2" />
                                Unggah Excel
                            </button>
                        </li>
                    )}
                    <li>
                        <button
                            onClick={handleDownload}
                            className="flex items-center"
                            type="button">
                            <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-4 h-4 mr-2" />
                            Unduh Excel
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
}

export default DownloadButtons;
