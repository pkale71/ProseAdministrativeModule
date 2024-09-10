import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSubGroupListComponent } from './school-sub-group-list.component';

describe('SchoolSubGroupListComponent', () => {
  let component: SchoolSubGroupListComponent;
  let fixture: ComponentFixture<SchoolSubGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSubGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSubGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
