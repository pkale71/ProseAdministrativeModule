import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusWiseSubjectEditComponent } from './syllabus-wise-subject-edit.component';

describe('SyllabusWiseSubjectEditComponent', () => {
  let component: SyllabusWiseSubjectEditComponent;
  let fixture: ComponentFixture<SyllabusWiseSubjectEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusWiseSubjectEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusWiseSubjectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
