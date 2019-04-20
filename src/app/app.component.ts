import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { WebsocketService, WS } from './modules/websocket';
import {environment} from "../environments/environment";
import {HotelsState} from "./reducers";
import {Store} from "@ngrx/store";
import {ActionTypes, AuthorizationTypesUnion, ConnectionTypesUnion, Reconnect, StartSearchHotels} from "./app.actions";
import {Hotel} from "./shared/models";

export interface IMessage {
    id: number;
    text: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public connection$: Observable<ConnectionTypesUnion>;
    public authorization$: Observable<AuthorizationTypesUnion>;
    public isLoading$: Observable<boolean>;
    public hotels$: Observable<Hotel[]>;
    public ActionTypes = ActionTypes;
    public filterForm: FormGroup;

    constructor(private fb: FormBuilder, private wsService: WebsocketService, private store$: Store<HotelsState>) {
    }

    ngOnInit() {
        this.filterForm = this.fb.group({
            dateFrom: [new Date(2019, 4, 1), Validators.required],
            dateTo: [new Date(2019, 4, 2), Validators.required],
        });

        this.hotels$ = this.store$.select('hotelsData.list');
        this.isLoading$ = this.store$.select('hotelsData.isLoading');
        this.connection$ = this.store$.select('connection');
        this.authorization$ = this.store$.select('authorization');
    }

    onReconnectClick() {
        this.store$.dispatch(new Reconnect)
    }

    onFilterFormSubmit(form) {
        if (form.valid) {

            const params = {
                timestampFrom: form.value.dateFrom.getTime(),
                timestampTo: form.value.dateTo.getTime(),
            };

            this.store$.dispatch(new StartSearchHotels(params));
        }
    }

}
