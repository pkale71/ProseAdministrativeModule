import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalGroupAddComponent } from './business-vertical-group-add.component';

describe('BusinessVerticalGroupAddComponent', () => {
  let component: BusinessVerticalGroupAddComponent;
  let fixture: ComponentFixture<BusinessVerticalGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalGroupAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
