import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TieUpSchoolDetailComponent } from './tie-up-school-detail.component';

describe('TieUpSchoolDetailComponent', () => {
  let component:TieUpSchoolDetailComponent;
  let fixture: ComponentFixture<TieUpSchoolDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TieUpSchoolDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
