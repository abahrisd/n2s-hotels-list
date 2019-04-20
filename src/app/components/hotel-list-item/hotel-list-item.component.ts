import {Component, Input, OnInit} from '@angular/core';
import {Hotel} from "../../shared/models";
import {environment} from "../../../environments/environment";
import get from 'lodash/get';

@Component({
    selector: 'app-hotel-list-item',
    templateUrl: './hotel-list-item.component.html',
    styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent {

    @Input() set hotel(value: Hotel) {
        const tpayment = get(value, 'items[0][0].commerce.tpayment');

        if (tpayment) {
            const payment = get(value, 'items[0][0].commerce.payment');
            this.discountPercents = Math.ceil((payment - tpayment)/payment*100);
        }

        this._hotel = value;
    }
    get hotel (): Hotel {
        return this._hotel;
    }
    private _hotel: Hotel;

    public environment = environment;
    public discountPercents: number;

}
