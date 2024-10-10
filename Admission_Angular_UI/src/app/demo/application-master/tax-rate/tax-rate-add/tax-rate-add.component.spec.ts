import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRateAddComponent } from './tax-rate-add.component';

describe('TaxRateAddComponent', () => {
  let component: TaxRateAddComponent;
  let fixture: ComponentFixture<TaxRateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxRateAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxRateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
