import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTypeEditComponent } from './discount-type-edit.component';

describe('DiscountTypeEditComponent', () => {
  let component: DiscountTypeEditComponent;
  let fixture: ComponentFixture<DiscountTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DiscountTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
