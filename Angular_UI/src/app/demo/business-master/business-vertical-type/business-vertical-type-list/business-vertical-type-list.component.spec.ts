import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalTypeListComponent } from './business-vertical-type-list.component';

describe('BusinessVerticalTypeListComponent', () => {
  let component: BusinessVerticalTypeListComponent;
  let fixture: ComponentFixture<BusinessVerticalTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
