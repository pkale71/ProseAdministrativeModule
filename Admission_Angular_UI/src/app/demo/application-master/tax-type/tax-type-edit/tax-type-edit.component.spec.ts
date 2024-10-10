import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTypeEditComponent } from './tax-type-edit.component';

describe('TaxTypeEditComponent', () => {
  let component: TaxTypeEditComponent;
  let fixture: ComponentFixture<TaxTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
