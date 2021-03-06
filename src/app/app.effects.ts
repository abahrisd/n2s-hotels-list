import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {ActionTypes, SearchHotels, SearchHotelsSuccess, Fail, StartSearchHotels, Empty} from './app.actions';
import {WebsocketService} from "./modules/websocket";
import {SearchParams} from "./shared/models/search-params.model";

@Injectable()
export class HotelsEffects {
    @Effect()
    searchHotels$ = this.actions$.pipe(
        ofType(ActionTypes.StartSearchHotels),
        map((action: StartSearchHotels) => action.payload),
        map((params: SearchParams) => {
            this.wsService.searchHotels(params);
            return new Empty;
        }),
        catchError(err => {
            return of(new Fail(err));
        })
    );

    @Effect()
    reconnect$ = this.actions$.pipe(
        ofType(ActionTypes.Reconnect),
        map(() => {
            this.wsService.connect()
            return new Empty;
        }),
        catchError(err => {
            return of(new Fail(err));
        })
    );

    /*@Effect()
    editNote$ = this.actions$.pipe(
        ofType(ActionTypes.Edit),
        map((action: Edit) => action.payload),
        mergeMap(data =>
            this.notesService.editNote(data).pipe(
                map(newNoteData => {
                    return new EditSuccess(newNoteData);
                }),
                catchError(err => {
                    return of(new Fail(err));
                })
            )
        )
    );

    @Effect()
    removeNote$ = this.actions$.pipe(
        ofType(ActionTypes.Remove),
        map((action: Remove) => action.payload),
        mergeMap(data =>
            this.notesService.removeNote(data).pipe(
                map(newNoteData => {
                    return new RemoveSuccess(newNoteData);
                }),
                catchError(err => {
                    return of(new Fail(err));
                })
            )
        )
    );

    @Effect()
    initData$ = this.actions$.pipe(
        ofType(ActionTypes.GetLocalData),
        mergeMap(() =>
            this.notesService.getInitData().pipe(
                map(initData => {
                    return new GetLocalDataSuccess(initData);
                }),
                catchError(err => {
                    return of(new Fail(err));
                })
            )
        )
    );*/

    constructor(private actions$: Actions, private wsService: WebsocketService) {}
}