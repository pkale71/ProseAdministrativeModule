import { ComponentFixture, TestBed } from '@angular/core/testing';

import {StudyCenterAddComponent } from './study-center-add.component';

describe('StudyCenterAddComponent', () => {
  let component:StudyCenterAddComponent;
  let fixture: ComponentFixture<StudyCenterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyCenterAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
