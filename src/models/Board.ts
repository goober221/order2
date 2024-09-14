export interface Board {
    bump_limit: number;
    category: string;
    default_name: string;
    enable_dices: boolean;
    enable_flags: boolean;
    enable_icons: boolean;
    enable_likes: boolean;
    enable_names: boolean;
    enable_oekaki: boolean;
    enable_posting: boolean;
    enable_sage: boolean;
    enable_shield: boolean;
    enable_subject: boolean;
    enable_thread_tags: boolean;
    enable_trips: boolean;
    file_types: string[];
    id: string;
    info: string;
    info_outer: string;
    max_comment: number;
    max_files_size: number;
    max_pages: number;
    name: string;
    threads_per_page: number;
}