import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolingProgramListComponent } from './schooling-program-list.component';

describe('GradeCategoryListComponent', () => {
  let component: SchoolingProgramListComponent;
  let fixture: ComponentFixture<SchoolingProgramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolingProgramListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolingProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
