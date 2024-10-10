import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTypeAddComponent } from './discount-type-add.component';

describe('DiscountTypeAddComponent', () => {
  let component: DiscountTypeAddComponent;
  let fixture: ComponentFixture<DiscountTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DiscountTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
