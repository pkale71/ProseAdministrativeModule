import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExitReasonEditComponent } from './course-exit-reason-edit.component';

describe('CourseExitReasonEditComponent', () => {
  let component: CourseExitReasonEditComponent;
  let fixture: ComponentFixture<CourseExitReasonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CourseExitReasonEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseExitReasonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
