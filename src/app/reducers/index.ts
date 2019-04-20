import {
    Action,
    ActionReducer,
    ActionReducerMap, combineReducers,
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
    HotelsAction, StartSearchHotels,
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
    connection: connectionReducer,
    authorization: authorizationReducer,
    hotelsData: combineReducers({
        isLoading: isLoadingReducer,
        searchResult: searchResultReducer,
    }),
};

/*export const hotelReducers: ActionReducerMap<HotelsState> = {
    isLoading: isLoadingReducer,
    searchResult: searchResultReducer,
};*/

export function connectionReducer(state: ConnectionTypesUnion = undefined, action: HotelsAction) {

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
            if (action.payload !== state ) {
                return action.payload;
            }
    }

    return state;
}

export function authorizationReducer(state: AuthorizationTypesUnion = undefined, action: HotelsAction) {

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

export function searchResultReducer(state: HotelsSearchResult = undefined, action: HotelsAction) {

    switch (action.type) {
        case ActionTypes.StartSearchHotels:
            return;
        case ActionTypes.UpdateHotels:
        case ActionTypes.SearchHotelsSuccess:
            console.log('searchResultReducer', action.payload);
            console.log('======= length: ', action.payload.search.length);
            return action.payload;
    }

    return state;
}