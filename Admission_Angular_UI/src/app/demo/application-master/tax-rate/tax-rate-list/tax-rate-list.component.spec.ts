import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRateListComponent } from './tax-rate-list.component';

describe('TaxRateListComponent', () => {
  let component: TaxRateListComponent;
  let fixture: ComponentFixture<TaxRateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxRateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
