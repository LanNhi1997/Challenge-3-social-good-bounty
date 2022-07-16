import React, {useState, useEffect} from 'react';
import thanks from '../assets/thanks.webp'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import {useNavigate} from 'react-router-dom';

function Thanks() {
    const navigate = useNavigate()
    const [totalDonated, setTotalDonated] = useState(0)
    useEffect(() => {
        window.contract.get_total_donated({}).then(result => {
            setTotalDonated(formatNearAmount(result))
        })
    }, [])

    return (
        <div className='hero-section d-flex'>
        <div className='hero-section-image'>
            <img src={thanks} />
        </div>
        <div className='thanks-place'>
            <div className='thanks-message'>
                <h1>
                    Thanks to your generosity, your money will be use to save sick kids
                </h1>
                <h2>
                    <span>{parseFloat(totalDonated).toFixed(2)} NEAR </span> was donated by you and the others, share this campaign to save more children
                </h2>
                <div className='d-flex justify-content-center'>
                    <div className='back-button' onClick={() => navigate('/')}>Back</div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Thanks;