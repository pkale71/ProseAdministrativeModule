import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileEditComponent } from './student-profile-edit.component';

describe('StudentProfileEditComponent', () => {
  let component: StudentProfileEditComponent;
  let fixture: ComponentFixture<StudentProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StudentProfileEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
