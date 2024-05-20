import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTimetableCalenderComponent } from './teacher-timetable-calender.component';

describe('TeacherTimetableCalenderComponent', () => {
  let component: TeacherTimetableCalenderComponent;
  let fixture: ComponentFixture<TeacherTimetableCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherTimetableCalenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherTimetableCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
