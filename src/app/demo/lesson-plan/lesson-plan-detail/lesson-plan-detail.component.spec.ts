import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanDetailComponent } from './lesson-plan-detail.component';

describe('LessonPlanDetailComponent', () => {
  let component: LessonPlanDetailComponent;
  let fixture: ComponentFixture<LessonPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
