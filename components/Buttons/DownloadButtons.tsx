import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../Dropdown";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BaseUri } from "@/apis/serverConfig";
import axios from "axios";
const baseUri = BaseUri();

const DownloadButtons = ({
    data, endpoint, params, onClick, afterClick, isDisabled = false
}: {
    data: any, endpoint: string, params: any, onClick?: any, afterClick: any, isDisabled?: boolean
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
            const url = window.URL.createObjectURL(new Blob([response.data.data.path]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'true');
            link.setAttribute('href', response.data.data.path);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            afterClick('success');
        } catch (err) {
            afterClick('error');
            console.log(err);
        }
    }

    return (
        <div className="dropdown">
            <Dropdown
                placement='top-start'
                btnClassName="btn btn-outline-info dropdown-toggle inline-flex"
                button={
                    <>
                        Unduh
                        <FontAwesomeIcon icon={faCloudDownloadAlt} className="w-4 h-4 ml-2" />
                    </>
                }
            >
                <ul className="!min-w-[170px]">
                    <li>
                        <button
                            onClick={handleDownload}
                            type="button">
                            Excel
                        </button>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
}

export default DownloadButtons;
