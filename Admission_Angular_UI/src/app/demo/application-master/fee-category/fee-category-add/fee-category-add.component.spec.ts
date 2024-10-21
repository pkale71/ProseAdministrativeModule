import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCategoryAddComponent } from './fee-category-add.component';

describe('FeeCategoryAddComponent', () => {
  let component: FeeCategoryAddComponent;
  let fixture: ComponentFixture<FeeCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeCategoryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
