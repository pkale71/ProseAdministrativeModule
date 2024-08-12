import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeWiseSyllabusEditComponent } from './grade-wise-syllabus-edit.component';

describe('GradeWiseSyllabusEditComponent', () => {
  let component: GradeWiseSyllabusEditComponent;
  let fixture: ComponentFixture<GradeWiseSyllabusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeWiseSyllabusEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeWiseSyllabusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
