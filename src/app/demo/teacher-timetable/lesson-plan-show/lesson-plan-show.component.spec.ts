import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanShowComponent } from './lesson-plan-show.component';

describe('LessonPlanShowComponent', () => {
  let component: LessonPlanShowComponent;
  let fixture: ComponentFixture<LessonPlanShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
