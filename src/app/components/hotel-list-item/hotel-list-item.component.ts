import { Component, Input, OnInit } from '@angular/core';
import get from 'lodash/get';

import { Hotel } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-hotel-list-item',
    templateUrl: './hotel-list-item.component.html',
    styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent {
    @Input() hotel: Hotel;

    public environment = environment;
}
