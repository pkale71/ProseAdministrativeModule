import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWiseChapterListComponent } from './subject-wise-chapter-list.component';

describe('GradeFormListComponent', () => {
  let component: SubjectWiseChapterListComponent;
  let fixture: ComponentFixture<SubjectWiseChapterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectWiseChapterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectWiseChapterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
