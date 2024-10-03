import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSchoolingProgramDetailComponent } from './school-schooling-program-detail.component';

describe('SchoolSchoolingProgramDetailComponent', () => {
  let component: SchoolSchoolingProgramDetailComponent;
  let fixture: ComponentFixture<SchoolSchoolingProgramDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SchoolSchoolingProgramDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSchoolingProgramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
