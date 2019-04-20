import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { WebsocketService, WS } from './modules/websocket';
import {environment} from "../environments/environment";
import {HotelsState} from "./reducers";
import {select, Store} from "@ngrx/store";
import {
    ActionTypes,
    AuthorizationTypesUnion,
    ConnectionTypesUnion,
    Reconnect,
    SetLoadingState,
    StartSearchHotels
} from "./app.actions";
import {Hotel, HotelsSearchResult} from "./shared/models";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {svgIcons} from "./app.constants";
import {map, take} from "rxjs/operators";

declare global {
    interface Window {
        store: any;
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public connection$: Observable<ActionTypes>;
    public authorization$: Observable<ActionTypes>;
    public isLoading$: Observable<boolean>;
    public total$: Observable<number>;
    public searchResult$: Observable<HotelsSearchResult>;
    public hotels$: Observable<Hotel[]>;
    public ActionTypes = ActionTypes;
    public filterForm: FormGroup;

    private takeHotelsCount = 20;
    private showResultsIncrement = 20;
    private showResultsIncrementText = 20;

    constructor(
        private fb: FormBuilder,
        private wsService: WebsocketService,
        private store$: Store<HotelsState>,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
    ) {
        // init all icons
        svgIcons.forEach(icon => {
            iconRegistry.addSvgIcon( icon.name, sanitizer.bypassSecurityTrustResourceUrl(icon.source));
        });
    }

    ngOnInit() {
        this.filterForm = this.fb.group({
            dateFrom: [new Date(2019, 4, 1), Validators.required],
            dateTo: [new Date(2019, 4, 2), Validators.required],
        });

        this.searchResult$ = this.store$.pipe(select('hotelsData', 'searchResult'));
        this.total$ = this.store$.pipe(select('hotelsData', 'searchResult', 'total'));
        this.hotels$ = this.store$.select('hotelsData', 'searchResult', 'search');
        this.isLoading$ = this.store$.pipe(select('hotelsData', 'isLoading'));
        this.connection$ = this.store$.pipe(select('connection'));
        this.authorization$ = this.store$.pipe(select('authorization'));
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
            this.store$.dispatch(new SetLoadingState(true));
        }
    }

}
