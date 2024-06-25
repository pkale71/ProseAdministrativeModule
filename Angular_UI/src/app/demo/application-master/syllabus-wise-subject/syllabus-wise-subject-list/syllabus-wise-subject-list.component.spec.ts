import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeWiseSyllabusListComponent } from './syllabus-wise-subject-list.component';

describe('GradeFormListComponent', () => {
  let component: GradeWiseSyllabusListComponent;
  let fixture: ComponentFixture<GradeWiseSyllabusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeWiseSyllabusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeWiseSyllabusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
