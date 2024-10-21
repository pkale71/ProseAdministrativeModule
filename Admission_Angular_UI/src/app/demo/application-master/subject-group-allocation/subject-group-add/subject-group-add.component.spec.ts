import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGroupAddComponent } from './subject-group-add.component';

describe('SubjectGroupAddComponent', () => {
  let component: SubjectGroupAddComponent;
  let fixture: ComponentFixture<SubjectGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubjectGroupAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
