import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationStageFiveComponent } from './b2c-application-stage-five.component';

describe('B2cApplicationStageFiveComponent', () => {
  let component: B2cApplicationStageFiveComponent;
  let fixture: ComponentFixture<B2cApplicationStageFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationStageFiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationStageFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
