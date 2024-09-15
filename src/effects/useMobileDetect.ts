import { useEffect, useState } from 'react';
import { mobileDetectService } from '../services/mobile-detect-service.ts';

export const useMobileDetect = (): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(mobileDetectService.getMobileModeStatus());

    useEffect(() => {
        const updateMobileStatus = () => {
            const currentMobileStatus = mobileDetectService.getMobileModeStatus();
            setIsMobile(currentMobileStatus);
        };

        updateMobileStatus();

        window.addEventListener('resize', updateMobileStatus);
        window.addEventListener('orientationchange', updateMobileStatus);

        return () => {
            window.removeEventListener('resize', updateMobileStatus);
            window.removeEventListener('orientationchange', updateMobileStatus);
        };
    }, []);

    return isMobile;
};