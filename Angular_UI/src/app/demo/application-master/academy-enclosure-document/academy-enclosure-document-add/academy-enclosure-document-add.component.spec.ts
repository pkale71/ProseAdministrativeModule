import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyEnclosureDocumentAddComponent } from './academy-enclosure-document-add.component';

describe('GradeCategoryAddComponent', () => {
  let component: AcademyEnclosureDocumentAddComponent;
  let fixture: ComponentFixture<AcademyEnclosureDocumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademyEnclosureDocumentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademyEnclosureDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
