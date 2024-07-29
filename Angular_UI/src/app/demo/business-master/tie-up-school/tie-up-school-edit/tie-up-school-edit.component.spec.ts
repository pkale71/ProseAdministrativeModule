import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpSchoolEditComponent } from './tie-up-school-edit.component';

describe('TieUpSchoolEditComponent', () => {
  let component: TieUpSchoolEditComponent;
  let fixture: ComponentFixture<TieUpSchoolEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpSchoolEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
