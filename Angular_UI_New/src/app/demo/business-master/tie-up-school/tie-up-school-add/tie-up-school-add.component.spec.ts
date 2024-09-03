import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TieUpSchoolAddComponent } from './tie-up-school-add.component';

describe('TieUpSchoolAddComponent', () => {
  let component:TieUpSchoolAddComponent;
  let fixture: ComponentFixture<TieUpSchoolAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TieUpSchoolAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
