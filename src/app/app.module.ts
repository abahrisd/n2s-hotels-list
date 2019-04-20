import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {EffectsModule} from "@ngrx/effects";
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from "@angular/material";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { reducers } from './reducers';
import { WebsocketModule } from './modules/websocket';
import { environment } from '../environments/environment';
import { HotelListItemComponent } from './components/hotel-list-item/hotel-list-item.component';
import {HotelsEffects} from "./app.effects";


@NgModule({
    declarations: [AppComponent, HotelListItemComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        EffectsModule.forRoot([HotelsEffects]),
        StoreModule.forRoot(reducers),
        WebsocketModule.config({
            url: environment.wsUrl
        }),
        BrowserAnimationsModule,

        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
