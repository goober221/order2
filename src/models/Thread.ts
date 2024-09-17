import {ThreadFile} from "./File.ts";
import {Post} from "./Post.ts";

export interface Thread {
    banned: number;
    board: string;
    closed: number;
    comment: string;
    date: string;
    email: string;
    endless: number;
    files: ThreadFile[];
    files_count: number;
    lasthit: number;
    name: string;
    num: number;
    op: number;
    parent: number;
    posts_count: number;
    sticky: number;
    subject: string;
    tags: string;
    timestamp: number;
    trip: string;
    views: number;
    posts?: Post[];
    title?: string;
    unique_posters?: number;
}

export interface FavedThread {
    num: string;
    posts_old: number;
    posts_new: number;
    title?: string;
}