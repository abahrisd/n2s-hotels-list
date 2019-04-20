import {Hotel} from "./hotel.model";

export class HotelsSearchResult {
    search: Hotel[];
    done: boolean;
    exptime: number;
    found: number;
    hash: string;
    constructor(public total: number = undefined){}
}