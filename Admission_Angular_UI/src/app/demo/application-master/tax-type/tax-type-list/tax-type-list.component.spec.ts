import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTypeListComponent } from './tax-type-list.component';

describe('TaxTypeListComponent', () => {
  let component: TaxTypeListComponent;
  let fixture: ComponentFixture<TaxTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaxTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
