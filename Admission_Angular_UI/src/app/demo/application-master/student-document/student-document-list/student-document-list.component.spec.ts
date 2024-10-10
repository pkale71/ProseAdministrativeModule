import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDocumentListComponent } from './student-document-list.component';

describe('StudentDocumentListComponent', () => {
  let component: StudentDocumentListComponent;
  let fixture: ComponentFixture<StudentDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StudentDocumentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
