import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRateEditComponent } from './tax-rate-edit.component';

describe('TaxRateEditComponent', () => {
  let component: TaxRateEditComponent;
  let fixture: ComponentFixture<TaxRateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxRateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxRateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
