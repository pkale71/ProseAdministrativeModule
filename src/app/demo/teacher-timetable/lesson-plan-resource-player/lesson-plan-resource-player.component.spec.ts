import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanResourcePlayerComponent } from './lesson-plan-resource-player.component';

describe('LessonPlanResourcePlayerComponent', () => {
  let component: LessonPlanResourcePlayerComponent;
  let fixture: ComponentFixture<LessonPlanResourcePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LessonPlanResourcePlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanResourcePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
