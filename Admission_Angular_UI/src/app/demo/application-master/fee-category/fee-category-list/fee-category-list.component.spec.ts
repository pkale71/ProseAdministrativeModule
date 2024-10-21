import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCategoryListComponent } from './fee-category-list.component';

describe('FeeCategoryListComponent', () => {
  let component: FeeCategoryListComponent;
  let fixture: ComponentFixture<FeeCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
