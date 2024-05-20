import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeScheduleSettingAddComponent } from './grade-schedule-setting-add.component';

describe('GradeScheduleSettingAddComponent', () => {
  let component: GradeScheduleSettingAddComponent;
  let fixture: ComponentFixture<GradeScheduleSettingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeScheduleSettingAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeScheduleSettingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
