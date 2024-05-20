import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearCalenderAddComponent } from './year-calender-add.component';

describe('YearCalenderAddComponent', () => {
  let component: YearCalenderAddComponent;
  let fixture: ComponentFixture<YearCalenderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearCalenderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearCalenderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
