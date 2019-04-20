import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
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
    ConneectSuccess, SearchHotelsSuccess,
    UpdateHotels
} from "../../app.actions";
import {wsSuccesStatus} from "../../app.constants";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements /*IWebsocketService,*/ OnDestroy {

    private config: WebSocketSubjectConfig<IWsMessage<any>>;

    private websocketSub: SubscriptionLike;
    private statusSub: SubscriptionLike;

    private reconnection$: Observable<number>;
    private websocket$: WebSocketSubject<IWsMessage<any>>;
    private connection$: Observer<boolean>;
    private wsMessages$: Subject<IWsMessage<any>>;

    private reconnectInterval: number;
    private reconnectAttempts: number;
    private isConnected: boolean;

    public status$: Observable<boolean>;
    public isLoading$ = new Subject<boolean>();
    private lastParams: SearchParams;
    private searchResult: any;
    // private isLoading$ = new Subject<boolean>;

    constructor(@Inject(config) private wsConfig: WebSocketConfig, private store$: Store<HotelsState>) {
        this.wsMessages$ = new Subject<IWsMessage<any>>();

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

        // connection status$
        this.status$ = new Observable<boolean>((observer) => {
            this.connection$ = observer;
        }).pipe(share(), distinctUntilChanged());

        // run reconnect if not connection
        this.statusSub = this.status$
            .subscribe((isConnected) => {
                this.isConnected = isConnected;

                if (!this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
                    this.store$.dispatch(new ConneectFail());
                    console.log('reconnect', );
                    this.reconnect();
                } else {
                    this.authorize();
                }

            });

        this.websocketSub = this.wsMessages$.subscribe(
            ((response: any) => {

                /*
                * итак
                * здесь надо собирать результат в переменную/поток до тех пор пока поле data.done не будет равно true
                * как только data.done === true, показываем результаты, или можно показывать результаты по ходу
                * да, лучше показывать по ходу
                *
                * до тех пор пока lastKey === key и data.done !== true - повторяем запрос
                * зачем нужна проверка ключа? Например может быть несколько запросов в одном подключении и разделять мы их сможем только по ключу
                * но они не обязательно будут паралельными, поэтому сравнивать предыдущий с последующим не корректно...
                * занчит будем смотреть только по done для нового запроса
                *
                * */

                console.log('ws message', response);

                if (response.status === wsSuccesStatus) {
                    this.store$.dispatch(new AutorizeSuccess);
                } else {
                    this.store$.dispatch(new AutorizeFail);
                }

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

                // показываем промежуточные результаты


                console.log('searchResult', this.searchResult);
                if (get(response, 'data.done') === false) {
                    this.store$.dispatch(new UpdateHotels(this.searchResult.data));
                    this.searchHotels();
                } else {
                    this.store$.dispatch(new SearchHotelsSuccess(this.searchResult.data));
                    console.log('done!', this.searchResult);
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
        // debugger;
        this.store$.dispatch(new Conneect());
        this.websocket$ = new WebSocketSubject(this.config);

        this.websocket$.subscribe(
            (message) => {
                return this.wsMessages$.next(message)
            },
            (error: Event) => {
                if (!this.websocket$) {
                    // run reconnect if errors
                    this.reconnect();
                }
            }
        );
    }

    private authorize() {
        this.store$.dispatch(new AutorizeStart);
        console.log('authorize');
        this.send(environment.wsAuthenticate);
    }

    private reconnect(): void {
        this.reconnection$ = interval(this.reconnectInterval)
            .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

        this.reconnection$.subscribe(
            () => this.connect(),
            null,
            () => {
                // Subject complete if reconnect attempts ending
                this.reconnection$ = null;

                if (!this.websocket$) {
                    this.store$.dispatch(new ConneectReconnectionExceed());
                    this.wsMessages$.complete();
                    this.connection$.complete();
                }
            });
    }

    /*
    * on message event
    * */
    /*public on<T>(event: string): Observable<T> {
        if (event) {
            return this.wsMessages$.pipe(
                filter((message: IWsMessage<T>) => message.event === event),
                map((message: IWsMessage<T>) => message.data)
            );
        }
    }*/

    /**
     * Подписка на сообщения
     */
    public getMessages(): Observable<any> {
        return this.wsMessages$.pipe(
            tap((message) => {
                console.log('getMessages tap 1 message', message);

                this.isLoading$.next(true);
            }),
            filter((message: any) => message.done === true),
            tap((message) => {
                console.log('getMessages tap 2 message', message);
                if (message) {
                    this.isLoading$.next(false);
                }
            }),
            distinctUntilChanged(),
        );
    }

    /*
    * on message to server
    * */
    // public send(action: string, data: any = {}): void {
    public send(request: any): void {
        /*
        * нам надо повторять запрос если data.done === false
        * знаем мы это только в подписке websocketSub, т.е. в ngonchanges
        * причём никак сопоставить запрос с входными данными мы не можем...\
        * можно сохранять первый результат с key во временную переменную
        *   1. если у него done - true, тогда дело сделано
        *   2. если done = false, тогда следующие ответы можно сравнивать с уже сохраненным временным значением по key
        *   если
        *
        * для начала сделаем что бы просто работало, через сохранение последних параметров
        *
        *
        * */

        const repeatRequest = new Subject();

        console.log('send request', request);

        if (request && this.isConnected) {
            this.websocket$.next(request);
        } else {
            console.error('Send error!');
        }
    }

    /**
     * Поиск отелей
     * если params не переданы выполняет запрос с последними параметрами
     * @param params
     */
    public searchHotels(params?: SearchParams): void {

        if (params) {
            this.lastParams = params;
        }

        params = params || this.lastParams;

        console.log('searchHotels params', params);

        if (!params) {
            throw Error('searchHotels: No params received');
        }

        const searchParams = {
            "action": "accommodation",
            "data": {
                "place": {
                    "in": "CI005575LO"
                },
                "date": {
                    "in": params.timestampFrom,
                    "out": params.timestampTo
                    // "in": 1558915200000,
                    // "out": 1559001600000
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

}