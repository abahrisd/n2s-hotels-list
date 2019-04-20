import { Action } from '@ngrx/store';
import {SearchParams} from "./shared/models/search-params.model";
import {Hotel} from "./shared/models/hotel.model";
import {HotelsSearchResult} from "./shared/models";

export enum ActionTypes {
    Conneect = '[App] Conneect',
    Reconnect = '[App] Reconnect',
    ConneectSuccess = '[App] ConneectSuccess',
    ConneectFail = '[App] ConneectFail',
    ConneectReconnectionExceed = '[App] ConneectReconnectionExceed',

    AutorizeStart = '[App] AutorizeStart',
    AutorizeSuccess = '[App] AutorizeSuccess',
    AutorizeFail = '[App] AutorizeFail',

    Empty = 'App Component] Empty',

    SearchHotels = '[Search Hotels Component] SearchHotels',
    UpdateHotels = '[Search Hotels Component] UpdateHotels',
    StartSearchHotels = '[Search Hotels Component] StartSearchHotels',
    SearchHotelsSuccess = '[Search Hotels Component] SearchHotelsSuccess',
    Fail = '[Search Hotels Component] Fail',
}

export class Conneect implements Action {
    readonly type = ActionTypes.Conneect;
}
export class Reconnect implements Action {
    readonly type = ActionTypes.Reconnect;
}
export class ConneectSuccess implements Action {
    readonly type = ActionTypes.ConneectSuccess;
}
export class ConneectFail implements Action {
    readonly type = ActionTypes.ConneectFail;
}
export class ConneectReconnectionExceed implements Action {
    readonly type = ActionTypes.ConneectReconnectionExceed;
}

export class AutorizeStart implements Action {
    readonly type = ActionTypes.AutorizeStart;
}
export class AutorizeSuccess implements Action {
    readonly type = ActionTypes.AutorizeSuccess;
}
export class AutorizeFail implements Action {
    readonly type = ActionTypes.AutorizeFail;
}

export class SearchHotels implements Action {
    readonly type = ActionTypes.SearchHotels;
    constructor(public payload: SearchParams) {}
}
export class StartSearchHotels implements Action {
    readonly type = ActionTypes.StartSearchHotels;
    constructor(public payload: SearchParams) {}
}
export class UpdateHotels implements Action {
    readonly type = ActionTypes.UpdateHotels;
    constructor(public payload: HotelsSearchResult) {}
}
export class SearchHotelsSuccess implements Action {
    readonly type = ActionTypes.SearchHotelsSuccess;
    constructor(public payload: HotelsSearchResult) {}
}

export class Fail implements Action {
    readonly type = ActionTypes.Fail;
    constructor(public payload: any) {}
}

export class Empty implements Action {
    readonly type = ActionTypes.Empty;
}

export class HotelsAction {
    type: string;
    payload?: any;
}

export type HotelsActionsUnion = SearchHotels | SearchHotelsSuccess | Fail | StartSearchHotels;

// типы коннекта, что бы не подить новые константы
export type ConnectionTypesUnion = ActionTypes.Conneect | ActionTypes.ConneectSuccess | ActionTypes.ConneectFail | ActionTypes.ConneectReconnectionExceed;
export type AuthorizationTypesUnion = ActionTypes.AutorizeStart | ActionTypes.AutorizeSuccess | ActionTypes.AutorizeFail;