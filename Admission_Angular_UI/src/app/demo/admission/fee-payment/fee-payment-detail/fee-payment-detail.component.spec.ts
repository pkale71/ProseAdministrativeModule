import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaymentDetailComponent } from './fee-payment-detail.component';

describe('FeePaymentDetailComponent', () => {
  let component: FeePaymentDetailComponent;
  let fixture: ComponentFixture<FeePaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeePaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
