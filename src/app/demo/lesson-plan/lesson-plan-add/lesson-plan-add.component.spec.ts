import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanAddComponent } from './lesson-plan-add.component';

describe('LessonPlanAddComponent', () => {
  let component: LessonPlanAddComponent;
  let fixture: ComponentFixture<LessonPlanAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
