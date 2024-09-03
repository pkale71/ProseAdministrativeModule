import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerCoachAddComponent } from './business-partner-coach-add.component';

describe('BusinessPartnerCoachAddComponent', () => {
  let component: BusinessPartnerCoachAddComponent;
  let fixture: ComponentFixture<BusinessPartnerCoachAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerCoachAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPartnerCoachAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
