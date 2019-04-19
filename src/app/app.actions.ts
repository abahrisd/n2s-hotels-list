import { Action } from '@ngrx/store';
import {SearchParams} from "./shared/models/search-params.model";

export enum ActionTypes {
    SearchHotels = '[Search Hotels Component] SearchHotels',
    SearchHotelsSuccess = '[Search Hotels Component] SearchHotelsSuccess',
    Fail = '[Search Hotels Component] Fail'
}

export class SearchHotels implements Action {
    readonly type = ActionTypes.SearchHotels;
    constructor(public payload: SearchParams) {}
}
export class SearchHotelsSuccess implements Action {
    readonly type = ActionTypes.SearchHotelsSuccess;
    constructor(public payload: any) {}
}

export class Fail implements Action {
    readonly type = ActionTypes.Fail;
    constructor(public payload: any) {}
}

export type HotelsActionsUnion = SearchHotels | SearchHotelsSuccess | Fail;