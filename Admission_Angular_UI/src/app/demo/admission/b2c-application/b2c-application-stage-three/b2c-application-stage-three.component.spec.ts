import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationStageThreeComponent } from './b2c-application-stage-three.component';

describe('B2cApplicationStageThreeComponent', () => {
  let component: B2cApplicationStageThreeComponent;
  let fixture: ComponentFixture<B2cApplicationStageThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationStageThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationStageThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
