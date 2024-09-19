import {Advertisements} from "./Advertisements.ts";
import {ThreadObj} from "./Thread.ts";
import {Board} from "./Board.ts";

export interface BoardData {
    board: Board;
    board_banner_image: string;
    board_banner_link: string;
    filter: string;
    threads: ThreadObj[];
    adverts: Advertisements;
}