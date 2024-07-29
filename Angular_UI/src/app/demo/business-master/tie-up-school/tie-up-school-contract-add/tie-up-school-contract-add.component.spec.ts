import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpSchoolContractAddComponent } from './tie-up-school-contract-add.component';

describe('TieUpSchoolContractAddComponent', () => {
  let component: TieUpSchoolContractAddComponent;
  let fixture: ComponentFixture<TieUpSchoolContractAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpSchoolContractAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpSchoolContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
