import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTypeAddComponent } from './fee-type-add.component';

describe('FeeTypeAddComponent', () => {
  let component: FeeTypeAddComponent;
  let fixture: ComponentFixture<FeeTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
