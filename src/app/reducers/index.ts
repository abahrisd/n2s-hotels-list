import {
    Action,
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {Hotel, HotelsSearchResult} from "../shared/models";
import {
    ActionTypes,
    AuthorizationTypesUnion,
    ConnectionTypesUnion,
    HotelsAction,
} from "../app.actions";


export interface HotelsState {
    connection: ConnectionTypesUnion;
    authorization: AuthorizationTypesUnion;
    hotelsData: {
        isLoading: boolean;
        searchResult: HotelsSearchResult
    }
}

export const reducers: ActionReducerMap<HotelsState> = {
    hotelsData: hotelsReducer,
    connection: connectionReducer,
    authorization: authorizationReducer,

};

export function connectionReducer(state: ConnectionTypesUnion = undefined, action: HotelsAction) {

    switch (action.type) {
        case ActionTypes.Conneect:
        case ActionTypes.ConneectSuccess:
        case ActionTypes.ConneectFail:
        case ActionTypes.ConneectReconnectionExceed:
            console.log('connectionReducer action', action);
            return action.type;
    }

    return state;
}

export function authorizationReducer(state: AuthorizationTypesUnion = undefined, action: HotelsAction) {

    switch (action.type) {
        case ActionTypes.AutorizeStart:
        case ActionTypes.AutorizeSuccess:
        case ActionTypes.AutorizeFail:
            console.log('authorizationReducer action', action);
            return action.type;
    }

    return state;
}

export function hotelsReducer(state = {isLoading: false, searchResult: new HotelsSearchResult}, action: HotelsAction) {
    let newState = {...state};

    console.log('hotelsReducer action', action);

    switch (action.type) {
        case ActionTypes.StartSearchHotels:
            newState.isLoading = true;
            break;
        case ActionTypes.UpdateHotels:
            newState.searchResult = action.payload;
            break;
        case ActionTypes.SearchHotelsSuccess:
            newState.isLoading = false;
            newState.searchResult = action.payload;
            break;
        case ActionTypes.Fail:
            newState.isLoading = false;
            break;
    }

    return newState;
}