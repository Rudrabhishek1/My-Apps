import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AdBanner: React.FC = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="my-4 text-center">
            {/* 
              Developer Note: 
              This is a responsive AdSense ad unit. 
              1. Replace "ca-pub-XXXXXXXXXXXXXXXX" with your AdSense Publisher ID.
              2. Replace "1234567890" with your Ad Unit's Slot ID.
              You can create new ad units in your Google AdSense dashboard.
            */}
            <ins 
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
                data-ad-slot="1234567890" 
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdBanner;
