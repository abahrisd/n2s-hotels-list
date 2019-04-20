import {Component, Input, OnInit} from '@angular/core';
import {Hotel} from "../../shared/models/hotel.model";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-hotel-list-item',
    templateUrl: './hotel-list-item.component.html',
    styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {

    @Input() hotel: Hotel = {
        info: {
            addr: 'addr',
            cat: 3,
            catid: 'catid',
            catname: 'catname',
            id: 'id',
            img: environment.imagesHost + '/1811ddfbfa0f57141bb92cd4eaff36b302e29c4b51a90f2711fe94c06ccbae1c_800_240.jpg',
            imgnum: 8,
            isdesc: true,
            name: 'addr',
            point: [53, 54],
            site: {
                label: 'addr',
                url: 'addr',
            }
        },
        items: [[{
            commerce: {
                currency: 1,
                discount: 1,
                offer: 'offer',
                original: 1,
                payment: 1,
                providerid: 'providerid',
                reservationfee: 1,
                tl: 1,
                tltime: 1,
                toriginal: 1,
                tpayment: 1,
            },
            meal: 'meal',
            type: 'type',
        }]],
    };

    // ""
    imgSrc
    discountPercent
    hotelName
    locationName
    tpayment
    payment

    constructor() {
    }

    ngOnInit() {3
    }

}
