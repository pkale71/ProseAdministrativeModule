import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanEditComponent } from './lesson-plan-edit.component';

describe('LessonPlanEditComponent', () => {
  let component: LessonPlanEditComponent;
  let fixture: ComponentFixture<LessonPlanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
