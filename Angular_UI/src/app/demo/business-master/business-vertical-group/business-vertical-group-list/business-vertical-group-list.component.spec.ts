import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalGroupListComponent } from './business-vertical-group-list.component';

describe('BusinessVerticalGroupListComponent', () => {
  let component: BusinessVerticalGroupListComponent;
  let fixture: ComponentFixture<BusinessVerticalGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
