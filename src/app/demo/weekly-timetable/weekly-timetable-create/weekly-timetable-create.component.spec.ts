import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTimetableCreateComponent } from './weekly-timetable-create.component';

describe('WeeklyTimetableCreateComponent', () => {
  let component: WeeklyTimetableCreateComponent;
  let fixture: ComponentFixture<WeeklyTimetableCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyTimetableCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyTimetableCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
