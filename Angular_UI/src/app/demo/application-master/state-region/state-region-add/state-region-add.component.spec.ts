import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRegionAddComponent } from './state-region-add.component';

describe('StateRegionAddComponent', () => {
  let component: StateRegionAddComponent;
  let fixture: ComponentFixture<StateRegionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateRegionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateRegionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
