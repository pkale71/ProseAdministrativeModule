import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationStageFourComponent } from './b2c-application-stage-four.component';

describe('B2cApplicationStageFourComponent', () => {
  let component: B2cApplicationStageFourComponent;
  let fixture: ComponentFixture<B2cApplicationStageFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationStageFourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationStageFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
