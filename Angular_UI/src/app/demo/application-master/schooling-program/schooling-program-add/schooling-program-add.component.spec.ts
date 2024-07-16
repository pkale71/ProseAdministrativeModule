import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolingProgramAddComponent } from './schooling-program-add.component';

describe('SchoolingProgramAddComponent', () => {
  let component: SchoolingProgramAddComponent;
  let fixture: ComponentFixture<SchoolingProgramAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolingProgramAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolingProgramAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
