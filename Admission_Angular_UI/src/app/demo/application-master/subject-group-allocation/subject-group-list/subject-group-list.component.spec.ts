import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGroupListComponent } from './subject-group-list.component';

describe('SubjectGroupListComponent', () => {
  let component: SubjectGroupListComponent;
  let fixture: ComponentFixture<SubjectGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubjectGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
