import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-stars-rating',
    templateUrl: './stars-rating.component.html',
    styleUrls: ['./stars-rating.component.css']
})
export class StarsRatingComponent{
    @Input() set starsCount(value: number) {
        this.starsArr = Array(value).fill(1);
    }

    starsArr: number[];
}
