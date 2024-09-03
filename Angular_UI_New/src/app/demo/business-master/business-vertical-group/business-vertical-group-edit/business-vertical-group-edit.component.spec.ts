import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalGroupEditComponent } from './business-vertical-group-edit.component';

describe('BusinessVerticalGroupEditComponent', () => {
  let component: BusinessVerticalGroupEditComponent;
  let fixture: ComponentFixture<BusinessVerticalGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalGroupEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
