import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTypeAddComponent } from './tax-type-add.component';

describe('TaxTypeAddComponent', () => {
  let component: TaxTypeAddComponent;
  let fixture: ComponentFixture<TaxTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
