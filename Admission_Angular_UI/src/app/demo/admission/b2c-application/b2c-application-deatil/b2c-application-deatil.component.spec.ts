import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationDeatilComponent } from './b2c-application-deatil.component';

describe('B2cApplicationDeatilComponent', () => {
  let component: B2cApplicationDeatilComponent;
  let fixture: ComponentFixture<B2cApplicationDeatilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationDeatilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
