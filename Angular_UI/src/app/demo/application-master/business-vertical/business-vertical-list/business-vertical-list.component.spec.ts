import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerticalListComponent } from './business-vertical-list.component';

describe('BusinessVerticalListComponent', () => {
  let component: BusinessVerticalListComponent;
  let fixture: ComponentFixture<BusinessVerticalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessVerticalListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerticalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
