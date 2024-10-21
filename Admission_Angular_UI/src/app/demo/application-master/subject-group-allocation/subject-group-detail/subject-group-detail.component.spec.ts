import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGroupDetailComponent } from './subject-group-detail.component';

describe('SubjectGroupDetailComponent', () => {
  let component: SubjectGroupDetailComponent;
  let fixture: ComponentFixture<SubjectGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubjectGroupDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
