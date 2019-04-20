import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelListItemComponent } from './hotel-list-item.component';

describe('HotelListItemComponent', () => {
  let component: HotelListItemComponent;
  let fixture: ComponentFixture<HotelListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
