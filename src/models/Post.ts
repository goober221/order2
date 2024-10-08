import {ThreadFile} from "./File.ts";

export interface Post {
    banned: number;
    board: string;
    closed: number;
    comment: string;
    date: string;
    email: string;
    endless: number;
    files: ThreadFile[] | null;
    lasthit: number;
    name: string;
    num: number;
    number: number;
    op: number;
    parent: number;
    sticky: number;
    subject: string;
    tags: string;
    timestamp: number;
    trip: string;
    views: number;
}

export interface PostDTO {
    banned: number;
    board: string;
    closed: number;
    comment: string;
    date: string;
    email: string;
    endless: number;
    files: ThreadFile[];
    lasthit: number;
    name: string;
    num: number;
    number: number;
    op: number;
    parent: number;
    sticky: number;
    subject: string;
    tags: string;
    timestamp: number;
    trip: string;
    views: number;
}

export interface PostData {
    board: string;
    thread: string;
    op_mark: string;
    usercode: string;
    code: string;
    captcha_type: string;
    email: string;
    name: string;
    subject: string;
    icon: string;
    comment: string;
    file: File[];
}