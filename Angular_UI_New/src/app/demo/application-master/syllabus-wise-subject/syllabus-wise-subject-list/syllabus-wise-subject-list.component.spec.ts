import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusWiseSubjectListComponent } from './syllabus-wise-subject-list.component';

describe('GradeFormListComponent', () => {
  let component: SyllabusWiseSubjectListComponent;
  let fixture: ComponentFixture<SyllabusWiseSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusWiseSubjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusWiseSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
