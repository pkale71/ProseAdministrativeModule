import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCategoryEditComponent } from './fee-category-edit.component';

describe('FeeCategoryEditComponent', () => {
  let component: FeeCategoryEditComponent;
  let fixture: ComponentFixture<FeeCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeCategoryEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
