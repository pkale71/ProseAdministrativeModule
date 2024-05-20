import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTimetableAddComponent } from './weekly-timetable-add.component';

describe('WeeklyTimetableAddComponent', () => {
  let component: WeeklyTimetableAddComponent;
  let fixture: ComponentFixture<WeeklyTimetableAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WeeklyTimetableAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyTimetableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
