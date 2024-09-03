import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusGradeCategoryAddComponent } from './syllabus-grade-category-add.component';

describe('SyllabusGradeCategoryAddComponent', () => {
  let component: SyllabusGradeCategoryAddComponent;
  let fixture: ComponentFixture<SyllabusGradeCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusGradeCategoryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusGradeCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
