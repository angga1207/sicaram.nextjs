import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';


const Index = () => {
    return (
        <>
            <div className='panel'>
                <h1 className='text-center font-semibold text-xl'>
                    Si Caram Ogan Ilir
                </h1>
                <div className='flex justify-center items-center font-semibold text-orange-500'>
                    <FontAwesomeIcon icon={faExclamationTriangle} className='w-4 h-4 mr-1' />
                    Work in Progress
                </div>
            </div>
        </>
    );
};

export default Index;
