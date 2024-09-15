export class MobileDetectService {
    private isMobileMode: boolean;

    constructor() {
        this.isMobileMode = this.checkMobileMode();

        window.addEventListener('resize', this.updateMobileMode.bind(this));
        window.addEventListener('orientationchange', this.updateMobileMode.bind(this));
    }

    private checkMobileMode(): boolean {
        const width = window.innerWidth;
        const height = window.innerHeight;


        return (width / height) <= 1;
    }

    private updateMobileMode() {
        const newMobileMode = this.checkMobileMode();
        if (newMobileMode !== this.isMobileMode) {
            this.isMobileMode = newMobileMode;
        }
    }

    public getMobileModeStatus(): boolean {
        return this.isMobileMode;
    }

    public destroy() {
        window.removeEventListener('resize', this.updateMobileMode.bind(this));
        window.removeEventListener('orientationchange', this.updateMobileMode.bind(this));
    }
}

// Create and export an instance of the service
export const mobileDetectService = new MobileDetectService();