import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalTypeEditComponent } from './business-vertical-type-edit.component';

describe('BusinessVerticalTypeEditComponent', () => {
  let component: BusinessVerticalTypeEditComponent;
  let fixture: ComponentFixture<BusinessVerticalTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
