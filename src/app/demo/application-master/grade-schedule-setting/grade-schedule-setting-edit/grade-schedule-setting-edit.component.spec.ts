import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeScheduleSettingEditComponent } from './grade-schedule-setting-edit.component';

describe('GradeScheduleSettingEditComponent', () => {
  let component: GradeScheduleSettingEditComponent;
  let fixture: ComponentFixture<GradeScheduleSettingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeScheduleSettingEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeScheduleSettingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
