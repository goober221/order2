import {CaptchaId} from "../models/Captcha.ts";
import axios from "axios";

export async function getCaptchaId(): Promise<CaptchaId | undefined> {
    try {
        const response = await axios.get<CaptchaId>('/api/api/captcha/emoji/id');
        return response.data;
    } catch (error) {
        console.error('Error fetching captcha id from 2ch:', error);
        return undefined;
    }
}

export async function getInitialCaptcha(id?: string) {
    return await axios.get('/api/api/captcha/emoji/show', {params: {id: id}}).then((response) => {
        return response.data;
    });
}