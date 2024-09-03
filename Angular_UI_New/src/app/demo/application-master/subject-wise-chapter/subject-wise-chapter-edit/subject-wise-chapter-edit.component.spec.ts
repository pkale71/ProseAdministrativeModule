import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectwiseChapterEditComponent } from './subject-wise-chapter-edit.component';

describe('SyllabusWiseSubjectEditComponent', () => {
  let component: SubjectwiseChapterEditComponent;
  let fixture: ComponentFixture<SubjectwiseChapterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectwiseChapterEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectwiseChapterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
