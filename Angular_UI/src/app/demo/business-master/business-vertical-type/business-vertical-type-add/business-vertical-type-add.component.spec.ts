import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalTypeAddComponent } from './business-vertical-type-add.component';

describe('BusinessVerticalTypeAddComponent', () => {
  let component: BusinessVerticalTypeAddComponent;
  let fixture: ComponentFixture<BusinessVerticalTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
