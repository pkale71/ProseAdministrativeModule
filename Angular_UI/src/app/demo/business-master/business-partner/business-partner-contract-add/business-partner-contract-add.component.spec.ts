import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerContractAddComponent } from './business-partner-contract-add.component';

describe('BusinessPartnerContractAddComponent', () => {
  let component: BusinessPartnerContractAddComponent;
  let fixture: ComponentFixture<BusinessPartnerContractAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerContractAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
