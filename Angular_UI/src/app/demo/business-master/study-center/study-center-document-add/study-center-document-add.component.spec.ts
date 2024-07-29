import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCenterDocumentAddComponent } from './study-center-document-add.component';

describe('StudyCenterDocumentAddComponent', () => {
  let component: StudyCenterDocumentAddComponent;
  let fixture: ComponentFixture<StudyCenterDocumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyCenterDocumentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
