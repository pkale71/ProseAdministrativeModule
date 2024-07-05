import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerListComponent } from './business-partner-list.component';

describe('BusinessPartnerListComponent', () => {
  let component: BusinessPartnerListComponent;
  let fixture: ComponentFixture<BusinessPartnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
