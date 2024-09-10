import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSubGroupAddComponent } from './school-sub-group-add.component';

describe('SchoolSubGroupAddComponent', () => {
  let component: SchoolSubGroupAddComponent;
  let fixture: ComponentFixture<SchoolSubGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSubGroupAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolSubGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
