import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { WebsocketModule } from './modules/websocket';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from "@angular/material";
import { HotelListItemComponent } from './components/hotel-list-item/hotel-list-item.component';


@NgModule({
    declarations: [AppComponent, HotelListItemComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
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
