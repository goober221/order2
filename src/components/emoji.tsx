import React, { useEffect, useState } from 'react';
import {getCaptchaId, getInitialCaptcha} from "../services/emoji.service.ts";
import {Base64Json} from "../models/Captcha.ts";


const CaptchaImage: React.FC = () => {
    const [captchaImage, setCaptchaImage] = useState<string | undefined>(undefined);
    const [captchaId, setCaptchaId] = useState<string | undefined>(undefined);
    const fetchCaptchaImage = async () => {
        try {
            const newCaptchaId = (await getCaptchaId())?.id
            setCaptchaId(newCaptchaId);
            const base64: Base64Json = await getInitialCaptcha(newCaptchaId);

            const fullBase64Image = `data:image/png;base64,${base64.image}`;
            const keyboard = base64.keyboard.map(k => {
                return `data:image/png;base64,${k}`
            })

            setCaptchaImage(fullBase64Image);
        } catch (error) {
            console.error('Error fetching captcha image:', error);
        }
    };

    useEffect(() => {
            fetchCaptchaImage();
    }, []);

    return (
        <div className='w-auto p-6 rounded-lg border-2 border-orange-600 dark:border-white'>
            {captchaImage ? (
                <img src={captchaImage} alt="Captcha" />
            ) : (
                <p>Loading captcha...</p>
            )}
        </div>
    );
};

export default CaptchaImage;
