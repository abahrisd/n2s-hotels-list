import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { WebsocketService, WS } from './modules/websocket';
import {environment} from "../environments/environment";
import {State} from "./reducers";
import {Store} from "@ngrx/store";

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
    title = 'n2s-hotels-list';

    private messages$: Observable<IMessage[]>;
    private counter$: Observable<number>;
    private texts$: Observable<string[]>;
    public isLoading$: Observable<boolean>;
    public isLoading = false;

    public filterForm: FormGroup;

    constructor(private fb: FormBuilder, private wsService: WebsocketService, private store$: Store<State>) {
    }

    ngOnInit() {
        this.filterForm = this.fb.group({
            dateFrom: ['', Validators.required],
            dateTo: ['', Validators.required],
        });

        this.isLoading$ = this.wsService.isLoading$;

        // this.isLoading$ = this.store$.select('hotelsData.isLoading');

        this.authorize();

        // get messages
        this.messages$ = this.wsService.getMessages();

        // get counter
        // this.counter$ = this.wsService.on<number>(WS.ON.COUNTER);

        // get texts
        // this.texts$ = this.wsService.on<string[]>(WS.ON.UPDATE_TEXTS);
    }
    authorize() {
        this.wsService.send(JSON.parse(environment.wsAuthenticate));
    }

    public searchHotels(params): void {
        const searchRequest = {
            "action": "accommodation",
            "data": {
                "place": {
                    "in": "CI005575LO"
                    },
                "date": {
                    "in": 1558915200000,
                    "out": 1559001600000
                    },
                "families": [
                    {
                    "adults": 2
                    }
                ],
                "lastid": 0,
                "num": 5
            },
            "key": "58fd27fa-4f81-4e67-a6bf-0e0e3fe4d876",
            "type": "service"
        };

        this.wsService.isLoading$.next(true);

        setTimeout(() => {
            this.wsService.isLoading$.next(false);
        }, 2000);

        // this.wsService.searchHotels(params)
        // this.wsService.send(searchRequest);
    }

    onFilterFormSubmit(form) {
        if (form.valid) {
            const params = Object.keys(form.value).reduce((acc, val) => {
                acc[val] = form.value[val].getTime();
                return acc;
            }, {});

            this.searchHotels(params);
        }
    }

}
