import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {EffectsModule} from "@ngrx/effects";
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule
} from "@angular/material";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import {/*hotelReducers,*/ reducers} from './reducers';
import { WebsocketModule } from './modules/websocket';
import { environment } from '../environments/environment';
import { HotelListItemComponent } from './components/hotel-list-item/hotel-list-item.component';
import {HotelsEffects} from "./app.effects";
import { StarsRatingComponent } from './shared/components/stars-rating/stars-rating.component';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [AppComponent, HotelListItemComponent, StarsRatingComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
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
        MatIconModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
