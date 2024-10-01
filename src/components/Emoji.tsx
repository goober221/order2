import React, { useEffect, useState } from 'react';
import {getCaptchaId, getInitialCaptcha} from "../services/emoji.service.ts";
import {Base64Json} from "../models/Captcha.ts";


const CaptchaImage: React.FC = () => {
    const [captchaImage, setCaptchaImage] = useState<string | undefined>(undefined);
    const [captchaKeyBoardImages, setCaptchaKeyBoardImages] = useState<string[] | undefined>(undefined);
    const [captchaId, setCaptchaId] = useState<string | undefined>(undefined);
    const fetchCaptchaImage = async () => {
        try {
            const newCaptchaId = (await getCaptchaId())?.id
            setCaptchaId(newCaptchaId);
            setCaptchaImage(undefined);
            setCaptchaKeyBoardImages(undefined);
            const base64: Base64Json = await getInitialCaptcha(newCaptchaId);

            const fullBase64Image = `data:image/png;base64,${base64.image}`;
            setCaptchaKeyBoardImages(base64.keyboard.map(k => {
                return `data:image/png;base64,${k}`
            }))

            setCaptchaImage(fullBase64Image);
        } catch (error) {
            console.error('Error fetching captcha image:', error);
        }
    };

    useEffect(() => {
            fetchCaptchaImage();
    }, []);

    return (
        <div className='max-w-72 rounded-lg border-2 border-orange-600 dark:border-white'>
            {captchaImage ? (
                <>
                    <div>
                        <img src={captchaImage} alt="Captcha" onClick={fetchCaptchaImage}
                             className="rounded-t-md mx-auto"/>
                    </div>
                    {captchaKeyBoardImages && (
                        <div className='max-w-sm mx-auto flex flex-wrap justify-center gap-2 my-4'>
                            {captchaKeyBoardImages.map((k, i) => (
                                <img
                                    className='invert-0 dark:invert w-1/6'
                                    key={i}
                                    src={k}
                                    alt="Captcha"
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Loading captcha...</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6" onClick={fetchCaptchaImage}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                    </svg>
                </>
            )}
        </div>
    );
};

export default CaptchaImage;
