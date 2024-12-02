import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationStageTwoComponent } from './b2c-application-stage-two.component';

describe('B2cApplicationStageTwoComponent', () => {
  let component: B2cApplicationStageTwoComponent;
  let fixture: ComponentFixture<B2cApplicationStageTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationStageTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationStageTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
