import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDocumentAddComponent } from './student-document-add.component';

describe('StudentDocumentAddComponent', () => {
  let component: StudentDocumentAddComponent;
  let fixture: ComponentFixture<StudentDocumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StudentDocumentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
