import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructureDetailComponent } from './fee-structure-detail.component';

describe('FeeStructureDetailComponent', () => {
  let component: FeeStructureDetailComponent;
  let fixture: ComponentFixture<FeeStructureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeStructureDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeStructureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
