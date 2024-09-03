import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAddComponent } from './grade-wise-syllabus-add.component';

describe('GradeCategoryAddComponent', () => {
  let component: GradeAddComponent;
  let fixture: ComponentFixture<GradeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
