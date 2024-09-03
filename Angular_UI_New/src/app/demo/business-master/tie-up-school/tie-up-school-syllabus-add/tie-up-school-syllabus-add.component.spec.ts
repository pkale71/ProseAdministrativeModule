import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpSchoolSyllabusAddComponent } from './tie-up-school-syllabus-add.component';

describe('TieUpSchoolSyllabusAddComponent', () => {
  let component: TieUpSchoolSyllabusAddComponent;
  let fixture: ComponentFixture<TieUpSchoolSyllabusAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpSchoolSyllabusAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolSyllabusAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
