import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRegionEditComponent } from './state-region-edit.component';

describe('StateRegionEditComponent', () => {
  let component: StateRegionEditComponent;
  let fixture: ComponentFixture<StateRegionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateRegionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateRegionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
