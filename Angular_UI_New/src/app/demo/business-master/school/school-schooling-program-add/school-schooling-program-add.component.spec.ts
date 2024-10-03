import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSchoolingProgramAddComponent } from './school-schooling-program-add.component';

describe('SchoolSchoolingProgramAddComponent', () => {
  let component: SchoolSchoolingProgramAddComponent;
  let fixture: ComponentFixture<SchoolSchoolingProgramAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SchoolSchoolingProgramAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSchoolingProgramAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
