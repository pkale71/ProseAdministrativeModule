import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpSchoolListComponent } from './tie-up-school-list.component';

describe('TieUpSchoolListComponent', () => {
  let component: TieUpSchoolListComponent;
  let fixture: ComponentFixture<TieUpSchoolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpSchoolListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
