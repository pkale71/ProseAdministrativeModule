import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExitReasonAddComponent } from './course-exit-reason-add.component';

describe('CourseExitReasonAddComponent', () => {
  let component: CourseExitReasonAddComponent;
  let fixture: ComponentFixture<CourseExitReasonAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CourseExitReasonAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseExitReasonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
