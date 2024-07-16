import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalEditComponent } from './business-vertical-edit.component';

describe('GradeCategoryAddComponent', () => {
  let component: BusinessVerticalEditComponent;
  let fixture: ComponentFixture<BusinessVerticalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
