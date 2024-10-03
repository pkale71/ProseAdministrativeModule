import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSchoolingProgramEditComponent } from './school-schooling-program-edit.component';

describe('SchoolSchoolingProgramEditComponent', () => {
  let component: SchoolSchoolingProgramEditComponent;
  let fixture: ComponentFixture<SchoolSchoolingProgramEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SchoolSchoolingProgramEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSchoolingProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
