import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolingGroupListComponent } from './schooling-group-list.component';

describe('SchoolingGroupListComponent', () => {
  let component: SchoolingGroupListComponent;
  let fixture: ComponentFixture<SchoolingGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolingGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolingGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
