import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeCategoryEditComponent } from './grade-category-edit.component';

describe('GradeCategoryEditComponent', () => {
  let component: GradeCategoryEditComponent;
  let fixture: ComponentFixture<GradeCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeCategoryEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
