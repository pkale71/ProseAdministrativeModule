import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationStageOneComponent } from './b2c-application-stage-one.component';

describe('B2cApplicationStageOneComponent', () => {
  let component: B2cApplicationStageOneComponent;
  let fixture: ComponentFixture<B2cApplicationStageOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationStageOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationStageOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
