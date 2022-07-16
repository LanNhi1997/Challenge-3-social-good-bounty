import React, {useState, useEffect} from 'react';

import HeroImage from '../assets/Hero-Liam.webp'

import axios from 'axios'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'


function Home(props) {

    const [donateValue, setDonateValue] = useState(0)
    const [price, setPrice] = useState(1)
    const [nearValue, setNearValue] = useState(0)
    const [totalDonated, setTotalDonated] = useState(0)
    useEffect(() => {
        window.contract.get_total_donated({}).then(result => setTotalDonated(formatNearAmount(result)))
        axios
            .get('https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd')
            .then(res => {
                const { data } = res
                setPrice(data['near']['usd'])
            })
            .catch(e => console.log(e))
    }, [])

    useEffect(() => {
        setNearValue(donateValue / price)
    }, [donateValue])

    const donate = async () => {
        if (!window.walletConnection.isSignedIn()) login()
        if (nearValue <= 0) return
        await window.contract.donate({
            args: {},
            gas: 30000000000000,
            amount: parseNearAmount(nearValue.toString()),
            callbackUrl: "https://nhiln-social-good.surge.sh/thanks"
        })
    }

    return (
        <div className='hero-section d-flex'>
            <div className='hero-section-image'>
                <img src={HeroImage} />
                <div className='hero-section-content'>
                    <h1 className='hero-title'>Working wonder for sick kids and their family</h1>
                    <p className='hero-description'>You can help sick and injured kids by funding life saving medical research, investing in vital new equipment, and providing support and entertainment for children and their family</p>
                </div>
                <div className='dark-layer'></div>
            </div>
            <div className='donation-place'>
                <div className='donation-content text-center'>

                    <h1>Help save children's lives. <span>Donate today</span>.</h1>
                    <div className='d-flex justify-content-between selectors'>
                        <div className='donate-select-box' onClick={() => setDonateValue(30)}>$30</div>
                        <div className='donate-select-box' onClick={() => setDonateValue(50)}>$50</div>
                        <div className='donate-select-box' onClick={() => setDonateValue(100)}>$100</div>
                        <div className='donate-select-box' onClick={() => setDonateValue(500)}>$500</div>
                    </div>
                    <div className='d-flex donation-input'>
                        <input type='number' className="input-value" value={donateValue} onChange={e => {
                            if (isNaN(e.target.value) || parseInt(e.target.value) < 0) return
                            setDonateValue(parseInt(e.target.value))
                        }} />
                    </div>
                    <div className='d-flex donation-value-in-near'>
                        ~ {nearValue.toFixed(2)} NEAR
                    </div>
                    <div className='d-flex justify-content-center mt-2 donate-button' onClick={donate}>
                        Donate
                    </div>
                    <h1 className='mt-3'>{parseFloat(totalDonated).toFixed(2)} NEAR donated</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;