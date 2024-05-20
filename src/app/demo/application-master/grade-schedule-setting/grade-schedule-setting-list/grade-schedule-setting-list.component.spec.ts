import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeScheduleSettingListComponent } from './grade-schedule-setting-list.component';

describe('GradeScheduleSettingListComponent', () => {
  let component: GradeScheduleSettingListComponent;
  let fixture: ComponentFixture<GradeScheduleSettingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeScheduleSettingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeScheduleSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
