import { ComponentFixture, TestBed } from '@angular/core/testing';

import {StudyCenterDetailComponent } from './study-center-detail.component';

describe('StudyCenterDetailComponent', () => {
  let component:StudyCenterDetailComponent;
  let fixture: ComponentFixture<StudyCenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyCenterDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
