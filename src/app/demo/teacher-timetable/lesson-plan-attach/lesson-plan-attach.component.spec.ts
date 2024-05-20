import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanAttachComponent } from './lesson-plan-attach.component';

describe('LessonPlanAttachComponent', () => {
  let component: LessonPlanAttachComponent;
  let fixture: ComponentFixture<LessonPlanAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
