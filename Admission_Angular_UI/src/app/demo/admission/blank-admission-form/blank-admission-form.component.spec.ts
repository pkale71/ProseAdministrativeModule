import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankAdmissionFormComponent } from './blank-admission-form.component';

describe('BlankAdmissionFormComponent', () => {
  let component: BlankAdmissionFormComponent;
  let fixture: ComponentFixture<BlankAdmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BlankAdmissionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlankAdmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
