import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearCalenderEditComponent } from './year-calender-edit.component';

describe('YearCalenderEditComponent', () => {
  let component: YearCalenderEditComponent;
  let fixture: ComponentFixture<YearCalenderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearCalenderEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearCalenderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
