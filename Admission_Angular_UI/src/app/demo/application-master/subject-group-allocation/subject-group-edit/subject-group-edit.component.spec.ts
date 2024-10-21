import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGroupEditComponent } from './subject-group-edit.component';

describe('SubjectGroupEditComponent', () => {
  let component: SubjectGroupEditComponent;
  let fixture: ComponentFixture<SubjectGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubjectGroupEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
