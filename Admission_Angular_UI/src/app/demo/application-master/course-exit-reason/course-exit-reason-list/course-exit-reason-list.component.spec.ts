import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExitReasonListComponent } from './course-exit-reason-list.component';

describe('CourseExitReasonListComponent', () => {
  let component: CourseExitReasonListComponent;
  let fixture: ComponentFixture<CourseExitReasonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CourseExitReasonListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseExitReasonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
