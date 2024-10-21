import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructureAddComponent } from './fee-structure-add.component';

describe('FeeStructureAddComponent', () => {
  let component: FeeStructureAddComponent;
  let fixture: ComponentFixture<FeeStructureAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeStructureAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeStructureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
