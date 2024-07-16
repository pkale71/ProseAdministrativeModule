import { ComponentFixture, TestBed } from '@angular/core/testing';

import {BusinessPartnerAddComponent } from './business-partner-add.component';

describe('BusinessPartnerAddComponent', () => {
  let component:BusinessPartnerAddComponent;
  let fixture: ComponentFixture<BusinessPartnerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessPartnerAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
