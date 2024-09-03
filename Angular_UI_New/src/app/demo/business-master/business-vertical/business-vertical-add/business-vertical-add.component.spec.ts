import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalAddComponent } from './business-vertical-add.component';

describe('GradeCategoryAddComponent', () => {
  let component: BusinessVerticalAddComponent;
  let fixture: ComponentFixture<BusinessVerticalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
