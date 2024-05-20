import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearCalenderListComponent } from './year-calender-list.component';

describe('YearCalenderListComponent', () => {
  let component: YearCalenderListComponent;
  let fixture: ComponentFixture<YearCalenderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearCalenderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearCalenderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
