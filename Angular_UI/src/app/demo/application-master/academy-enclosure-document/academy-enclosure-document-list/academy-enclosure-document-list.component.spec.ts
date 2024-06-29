import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyEnclosureDocumentListComponent } from './academy-enclosure-document-list.component';

describe('GradeFormListComponent', () => {
  let component: AcademyEnclosureDocumentListComponent;
  let fixture: ComponentFixture<AcademyEnclosureDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademyEnclosureDocumentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademyEnclosureDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
