import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerDocumentAddComponent } from './business-partner-document-add.component';

describe('BusinessPartnerDocumentAddComponent', () => {
  let component: BusinessPartnerDocumentAddComponent;
  let fixture: ComponentFixture<BusinessPartnerDocumentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerDocumentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
