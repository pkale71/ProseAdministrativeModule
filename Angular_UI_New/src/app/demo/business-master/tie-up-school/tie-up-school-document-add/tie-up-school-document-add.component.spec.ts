import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpSchoolDocumentAddComponent } from './tie-up-school-document-add.component';

describe('TieUpSchoolDocumentAddComponent', () => {
  let component: TieUpSchoolDocumentAddComponent;
  let fixture: ComponentFixture<TieUpSchoolDocumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpSchoolDocumentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
