export interface CaptchaId {
    challenge: {
        hash: string;
        limit: number;
        template: string;
    };
    id: string;
    input: string;
    result: number;
    type: string;
}

export interface Base64Json {
    image: string;
    keyboard: string[]
}