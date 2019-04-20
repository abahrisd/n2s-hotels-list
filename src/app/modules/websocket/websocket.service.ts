import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import {delay, filter, map, tap} from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import concat from 'lodash/concat';
import get from 'lodash/get';

import { share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { IWebsocketService, IWsMessage, WebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';
import {SearchParams} from "../../shared/models/search-params.model";
import {environment} from "../../../environments/environment";
import {Hotel} from "../../shared/models/hotel.model";
import {Store} from "@ngrx/store";
import {HotelsState} from "../../reducers";
import {
    AutorizeFail,
    AutorizeStart, AutorizeSuccess,
    Conneect,
    ConneectFail,
    ConneectReconnectionExceed,
    ConneectSuccess, SearchHotelsSuccess, SetLoadingState,
    UpdateHotels
} from "../../app.actions";
import {wsSuccesStatus} from "../../app.constants";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements /*IWebsocketService,*/ OnDestroy {

    private config: WebSocketSubjectConfig<any>;

    private websocketSub: SubscriptionLike;
    private statusSub: SubscriptionLike;

    private reconnection$: Observable<number>;
    private websocket$: WebSocketSubject<any>;
    private connection$: Observer<boolean>;
    private wsMessages$: Subject<any>;

    private reconnectInterval: number;
    private reconnectAttempts: number;
    private isConnected: boolean;

    public status$: Observable<boolean>;
    private lastParams: SearchParams;
    private searchResult: any;

    constructor(@Inject(config) private wsConfig: WebSocketConfig, private store$: Store<HotelsState>) {
        this.wsMessages$ = new Subject<any>();

        this.reconnectInterval = wsConfig.reconnectInterval || 5000; // pause between connections
        this.reconnectAttempts = wsConfig.reconnectAttempts || 10; // number of connection attempts

        this.config = {
            url: wsConfig.url,
            closeObserver: {
                next: (event: CloseEvent) => {
                    this.websocket$ = null;
                    this.connection$.next(false);
                }
            },
            openObserver: {
                next: (event: Event) => {
                    this.store$.dispatch(new ConneectSuccess());
                    this.connection$.next(true);
                }
            }
        };

        this.status$ = new Observable<boolean>((observer) => {
            this.connection$ = observer;
        }).pipe(share(), distinctUntilChanged());

        this.statusSub = this.status$
            .subscribe((isConnected) => {
                this.isConnected = isConnected;

                if (!this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
                    this.store$.dispatch(new ConneectFail());
                    this.reconnect();
                } else {
                    this.authorize();
                }
            });

        this.websocketSub = this.wsMessages$.subscribe(
            ((response: any) => {

                console.log('ws message', response);

                if (response.status === wsSuccesStatus) {
                    this.store$.dispatch(new AutorizeSuccess);
                } else {
                    this.store$.dispatch(new AutorizeFail);
                    return;
                }

                // если в ответе нет поля done - то это не поисковый запрос, а запрос авторизации, дальше не идём
                if (!response.data || !response.data.hasOwnProperty('done')){
                    return;
                }

                if (!this.searchResult || this.searchResult.key !== response.key) {
                    this.searchResult = response;
                } else {
                    const currentSearch = [...this.searchResult.data.search];
                    this.searchResult = response;
                    this.searchResult.data.search = concat(currentSearch, response.data.search);
                }

                // const searchResultData = this.getUpdatedSearchResultData(response);
                // console.log('searchResultData', searchResultData);

                if (get(response, 'data.done') === false) {
                    // if (response.data.hash !== this.searchResult.data.hash) {
                        this.store$.dispatch(new UpdateHotels(this.searchResult.data));
                    // }
                    this.repeatSearchHotelsWithLastParams();
                } else {
                    this.store$.dispatch(new SearchHotelsSuccess(this.searchResult.data));
                    this.store$.dispatch(new SetLoadingState(false));
                }

            }), (error: ErrorEvent) => console.error('WebSocket error!', error)
        );

        this.connect();
    }

    ngOnDestroy() {
        this.websocketSub.unsubscribe();
        this.statusSub.unsubscribe();
    }

    public connect(): void {
        this.store$.dispatch(new Conneect());
        this.websocket$ = new WebSocketSubject(this.config);

        this.websocket$.pipe(delay(2000)).subscribe(
            (message) => {
                return this.wsMessages$.next(message)
            },
            (error: Event) => {
                if (!this.websocket$) {
                    this.reconnect();
                }
            }
        );
    }

    private authorize() {
        this.store$.dispatch(new AutorizeStart);
        this.send(environment.wsAuthenticate);
    }

    private reconnect(): void {
        this.reconnection$ = interval(this.reconnectInterval)
            .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

        this.reconnection$.subscribe(
            () => this.connect(),
            null,
            () => {
                this.reconnection$ = null;

                if (!this.websocket$) {
                    this.store$.dispatch(new ConneectReconnectionExceed());
                    this.wsMessages$.complete();
                    this.connection$.complete();
                }
            });
    }

    public send(request: any): void {
        if (request && this.isConnected) {
            this.websocket$.next(request);
        } else {
            console.error('Send error!');
        }
    }

    public repeatSearchHotelsWithLastParams(): void {
        this.searchHotels(this.lastParams);
    }

    public searchHotels(params: SearchParams): void {
        if (!params) {
            throw Error('searchHotels: No params received');
        }

        this.lastParams = params;

        const searchParams = {
            "action": "accommodation",
            "data": {
                "place": {
                    "in": "CI005575LO"
                },
                "date": {
                    "in": params.timestampFrom,
                    "out": params.timestampTo
                },
                "families": [{
                    "adults": 2
                }],
                "lastid": 0,
                "num": 5
            },
            "key": "58fd27fa-4f81-4e67-a6bf-0e0e3fe4d876",
            "type": "service"
        };

        this.send(searchParams);
    }

    getUpdatedSearchResultData(response) {
        if (!this.searchResult || this.searchResult.key !== response.key) {
            this.searchResult = response;
        } else {
            const currentSearch = [...this.searchResult.data.search];
            this.searchResult = response;
            this.searchResult.data.search = concat(currentSearch, response.data.search);
        }

        return this.searchResult.data;
    }

}