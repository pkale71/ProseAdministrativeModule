import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTimetableDisplayComponent } from './weekly-timetable-display.component';

describe('WeeklyTimetableDisplayComponent', () => {
  let component: WeeklyTimetableDisplayComponent;
  let fixture: ComponentFixture<WeeklyTimetableDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WeeklyTimetableDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyTimetableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
