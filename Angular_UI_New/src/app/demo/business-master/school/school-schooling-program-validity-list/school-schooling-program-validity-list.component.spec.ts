import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSchoolingProgramValidityListComponent } from './school-schooling-program-validity-list.component';

describe('SchoolSchoolingProgramValidityListComponent', () => {
  let component: SchoolSchoolingProgramValidityListComponent;
  let fixture: ComponentFixture<SchoolSchoolingProgramValidityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SchoolSchoolingProgramValidityListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSchoolingProgramValidityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
