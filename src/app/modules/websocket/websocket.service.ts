import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { IWebsocketService, IWsMessage, WebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';
import {SearchParams} from "../../shared/models/search-params.model";
import {environment} from "../../../environments/environment";

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
    // private isLoading$ = new Subject<boolean>;

    constructor(@Inject(config) private wsConfig: WebSocketConfig) {
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
                    console.log('WebSocket connected!');
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
                    this.reconnect();
                }
            });

        this.websocketSub = this.wsMessages$.subscribe(
            null, (error: ErrorEvent) => console.error('WebSocket error!', error)
        );

        this.connect();
    }

    ngOnDestroy() {
        this.websocketSub.unsubscribe();
        this.statusSub.unsubscribe();
    }

    private connect(): void {
        this.websocket$ = new WebSocketSubject(this.config);

        this.websocket$.subscribe(
            (message) => this.wsMessages$.next(message),
            (error: Event) => {
                if (!this.websocket$) {
                    // run reconnect if errors
                    this.reconnect();
                }
            });
    }

    private reconnect(): void {
        this.reconnection$ = interval(this.reconnectInterval)
            .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

        this.reconnection$.subscribe(
            () => this.connect(),
            null,
            () => {
                // Subject complete if reconnect attemts ending
                this.reconnection$ = null;

                if (!this.websocket$) {
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
            tap(() => {
                this.isLoading$.next(true);
            }),
            filter((message: any) => message.done === true),
            tap((val) => {
                console.log('val', val);
                if (val) {
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
        if (event && this.isConnected) {
            this.websocket$.next(<any>JSON.stringify(request));
        } else {
            console.error('Send error!');
        }
    }

    /**
     * Поиск отелей
     * @param params
     */
    public searchHotels(params: SearchParams): void {
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

        if (this.isConnected) {
            this.websocket$.next(<any>JSON.stringify(searchParams));
        } else {
            if (environment.isDebug) {
                console.error('Search error: Connection lost');
            }
        }
    }

}