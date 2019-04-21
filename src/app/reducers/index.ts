import { ActionReducerMap } from '@ngrx/store';
import { HotelsSearchResult } from '../shared/models';
import { ActionTypes, AuthorizationTypesUnion, ConnectionTypesUnion, HotelsAction } from '../app.actions';

export interface HotelsState {
    connection: ConnectionTypesUnion;
    authorization: AuthorizationTypesUnion;
}

export interface HotelsDataState {
    isLoading: boolean;
    searchResult: HotelsSearchResult;
}

export const reducers: ActionReducerMap<HotelsState> = {
    connection: connectionReducer,
    authorization: authorizationReducer
};

export const hotelsDataReducers: ActionReducerMap<HotelsDataState> = {
    isLoading: isLoadingReducer,
    searchResult: searchResultReducer
};

export function connectionReducer(state: ConnectionTypesUnion, action: HotelsAction) {
    switch (action.type) {
        case ActionTypes.Conneect:
        case ActionTypes.ConneectSuccess:
        case ActionTypes.ConneectFail:
        case ActionTypes.ConneectReconnectionExceed:
            return action.type;
    }

    return state;
}

export function isLoadingReducer(state: boolean = false, action: HotelsAction) {
    switch (action.type) {
        case ActionTypes.SetLoadingState:
            if (action.payload !== state) {
                return action.payload;
            }
    }

    return state;
}

export function authorizationReducer(state: AuthorizationTypesUnion, action: HotelsAction) {
    switch (action.type) {
        case ActionTypes.AutorizeStart:
        case ActionTypes.AutorizeSuccess:
        case ActionTypes.AutorizeFail:
            if (state !== action.type) {
                return action.type;
            }
    }

    return state;
}

export function searchResultReducer(state: HotelsSearchResult, action: HotelsAction) {
    switch (action.type) {
        case ActionTypes.StartSearchHotels:
            return;
        case ActionTypes.UpdateHotels:
        case ActionTypes.SearchHotelsSuccess:
            return action.payload;
    }

    return state;
}
