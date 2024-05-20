import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanChangeStatusComponent } from './lesson-plan-change-status.component';

describe('LessonPlanChangeStatusComponent', () => {
  let component: LessonPlanChangeStatusComponent;
  let fixture: ComponentFixture<LessonPlanChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanChangeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
