import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCenterEditComponent } from './study-center-edit.component';

describe('StudyCenterEditComponent', () => {
  let component: StudyCenterEditComponent;
  let fixture: ComponentFixture<StudyCenterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyCenterEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
