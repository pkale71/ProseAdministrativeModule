import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicSessionFormListComponent } from './academic-session-list.component';

describe('GradeCategoryListComponent', () => {
  let component: AcademicSessionFormListComponent;
  let fixture: ComponentFixture<AcademicSessionFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicSessionFormListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicSessionFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
