import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGroupAllocationAddComponent } from './subject-group-allocation-add.component';

describe('SubjectGroupAllocationAddComponent', () => {
  let component: SubjectGroupAllocationAddComponent;
  let fixture: ComponentFixture<SubjectGroupAllocationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubjectGroupAllocationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGroupAllocationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
