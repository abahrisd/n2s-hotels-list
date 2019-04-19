import {
    Action,
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {Hotel} from "../shared/models/hotel.model";
import {ActionTypes, HotelsActionsUnion} from "../app.actions";

export interface State {
  hotelsData: {
    isLoading: boolean;
    list: Hotel[];
  }
}

export const reducers: ActionReducerMap<State> = {
    hotelsData: hotelsReducer
};

export function hotelsReducer(state = {isLoading: false, list: []}, action: HotelsActionsUnion) {
    let newState = { ...state };

    console.log('hotelsReducer action', action);

    switch (action.type) {
        case ActionTypes.SearchHotels:
            newState.isLoading = true;
            break;
        case ActionTypes.SearchHotelsSuccess:
            newState.isLoading = false;
            newState.list = action.payload;
            break;
        case ActionTypes.Fail:
            newState.isLoading = false;
            break;
    }

    return newState;
}